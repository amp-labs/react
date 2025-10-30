import { useCallback, useState } from "react";
import { GenerateConnectionOperationRequest } from "@generated/api/src";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider";
import { handleServerError } from "src/utils/handleServerError";

import { useCreateConnectionMutation } from "../useCreateConnectionMutation";

import { CustomAuthContent } from "./CustomAuthContent";
import { CustomAuthFlowProps } from "./CustomAuthFlowProps";
import { CustomAuthFormData } from "./LandingContentProps";

export function CustomAuthFlow({
  providerInfo,
  consumerRef,
  consumerName,
  groupRef,
  groupName,
  children,
  selectedConnection,
  metadataFields,
}: CustomAuthFlowProps) {
  const { projectIdOrName } = useAmpersandProviderProps();
  const createConnectionMutation = useCreateConnectionMutation();
  const [error, setError] = useState<string | null>(null);

  const onNext = useCallback(
    (form: CustomAuthFormData) => {
      const { customAuth, providerMetadata } = form;
      setError(null);

      const req: GenerateConnectionOperationRequest = {
        projectIdOrName,
        generateConnectionParams: {
          providerWorkspaceRef: providerMetadata?.workspace?.value,
          groupName,
          groupRef,
          consumerName,
          consumerRef,
          provider: providerInfo.name,
          customAuth,
          ...(providerMetadata && { providerMetadata }),
        },
      };
      // TODO: delete when custom auth is implemented
      // console.log("custom auth submit", { providerInfo, req });
      createConnectionMutation.mutate(req, {
        onError: (error) => {
          handleServerError(error, setError);
        },
        onSuccess: () => {
          setError(null);
        },
      });
    },
    [
      projectIdOrName,
      groupName,
      groupRef,
      consumerName,
      consumerRef,
      providerInfo.name,
      createConnectionMutation,
    ],
  );

  if (selectedConnection === null) {
    return (
      <CustomAuthContent
        providerInfo={providerInfo}
        handleSubmit={onNext}
        error={error}
        metadataFields={metadataFields}
      />
    );
  }

  return children;
}
