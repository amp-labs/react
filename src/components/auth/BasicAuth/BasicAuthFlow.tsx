import { useCallback } from "react";
import { GenerateConnectionOperationRequest } from "@generated/api/src";
import { useProject } from "context/ProjectContextProvider";

import { useCreateConnectionMutation } from "../useCreateConnectionMutation";

import { BasicAuthContent } from "./BasicAuthContent";
import { BasicAuthFlowProps } from "./BasicAuthFlowProps";
import { BasicCreds } from "./LandingContentProps";

export function BasicAuthFlow({
  provider,
  providerInfo,
  consumerRef,
  consumerName,
  groupRef,
  groupName,
  children,
  selectedConnection,
  metadataFields,
}: BasicAuthFlowProps) {
  const { projectIdOrName } = useProject();
  const createConnectionMutation = useCreateConnectionMutation();

  const onNext = useCallback(
    (form: BasicCreds) => {
      const { user, pass, providerMetadata } = form;

      const req: GenerateConnectionOperationRequest = {
        projectIdOrName,
        generateConnectionParams: {
          providerWorkspaceRef: providerMetadata?.workspace?.value,
          groupName,
          groupRef,
          consumerName,
          consumerRef,
          provider,
          basicAuth: {
            username: user,
            password: pass,
          },
          ...(providerMetadata && { providerMetadata: providerMetadata }),
        },
      };
      createConnectionMutation.mutate(req);
    },
    [
      projectIdOrName,
      groupName,
      groupRef,
      consumerName,
      consumerRef,
      provider,
      createConnectionMutation,
    ],
  );

  if (selectedConnection === null) {
    return (
      <BasicAuthContent
        provider={provider}
        providerInfo={providerInfo}
        handleSubmit={onNext}
        error={null}
        metadataFields={metadataFields}
      />
    );
  }

  return children;
}
