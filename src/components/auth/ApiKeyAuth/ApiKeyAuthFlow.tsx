import { useCallback } from "react";
import {
  GenerateConnectionOperationRequest,
  MetadataItemInput,
  ProviderInfo,
} from "@generated/api/src";
import { Connection } from "services/api";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider";

import { useCreateConnectionMutation } from "../useCreateConnectionMutation";

import { ApiKeyAuthContent } from "./ApiKeyAuthContent";
import { IFormType } from "./LandingContentProps";

type ApiKeyAuthFlowProps = {
  provider: string;
  providerInfo: ProviderInfo;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  children: JSX.Element;
  selectedConnection: Connection | null;
  metadataFields: MetadataItemInput[];
  moduleError?: string | null;
};

export function ApiKeyAuthFlow({
  provider,
  providerInfo,
  consumerRef,
  consumerName,
  groupRef,
  groupName,
  children,
  selectedConnection,
  metadataFields,
  moduleError,
}: ApiKeyAuthFlowProps) {
  const { projectIdOrName } = useAmpersandProviderProps();
  const createConnectionMutation = useCreateConnectionMutation();

  const onNext = useCallback(
    (form: IFormType) => {
      const { apiKey, providerMetadata } = form;

      const req: GenerateConnectionOperationRequest = {
        projectIdOrName,
        generateConnectionParams: {
          providerWorkspaceRef: providerMetadata?.workspace?.value,
          groupName,
          groupRef,
          consumerName,
          consumerRef,
          provider,
          apiKey,
          ...(providerMetadata && { providerMetadata }),
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
      <ApiKeyAuthContent
        provider={provider}
        providerInfo={providerInfo}
        handleSubmit={onNext}
        error={moduleError || null}
        metadataFields={metadataFields}
      />
    );
  }

  return children;
}
