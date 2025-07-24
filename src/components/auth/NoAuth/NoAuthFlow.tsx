import { useCallback } from "react";
import { GenerateConnectionOperationRequest } from "@generated/api/src";
import { Connection } from "services/api";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider";

import { useCreateConnectionMutation } from "../useCreateConnectionMutation";

import { NoAuthContent } from "./NoAuthContent";

type NoAuthFlowProps = {
  provider: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  providerName?: string;
  children: JSX.Element;
  selectedConnection: Connection | null;
};

/**
 * This flow is only used as for a mock provider. This flow is used for testing only.
 * @param param0
 * @returns
 */
export function NoAuthFlow({
  provider,
  consumerRef,
  consumerName,
  groupRef,
  groupName,
  children,
  selectedConnection,
  providerName,
}: NoAuthFlowProps) {
  const { projectIdOrName } = useAmpersandProviderProps();
  const createConnectionMutation = useCreateConnectionMutation();

  const onNext = useCallback(() => {
    const req: GenerateConnectionOperationRequest = {
      projectIdOrName,
      generateConnectionParams: {
        groupName,
        groupRef,
        consumerName,
        consumerRef,
        provider,
      },
    };
    createConnectionMutation.mutate(req);
  }, [
    projectIdOrName,
    groupName,
    groupRef,
    consumerName,
    consumerRef,
    provider,
    createConnectionMutation,
  ]);

  if (selectedConnection === null) {
    return (
      <NoAuthContent
        handleSubmit={onNext}
        error={null}
        providerName={providerName}
      />
    );
  }

  return children;
}
