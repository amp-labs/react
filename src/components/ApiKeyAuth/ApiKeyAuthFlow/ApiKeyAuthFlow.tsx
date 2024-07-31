import { useEffect, useState } from 'react';
import { GenerateConnectionRequest } from '@generated/api/src';

import { LandingContent } from 'components/ApiKeyAuth/ApiKeyAuthFlow/LandingContent';
import { useApiKey } from 'context/ApiKeyContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import { api, Connection } from 'services/api';

type ApiKeyAuthFlowProps = {
  provider: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  children: JSX.Element,
  selectedConnection: Connection | null;
  setSelectedConnection: (connection: Connection | null) => void;
};

export function ApiKeyAuthFlow({
  provider, consumerRef, consumerName, groupRef, groupName, children, selectedConnection, setSelectedConnection,
}: ApiKeyAuthFlowProps) {
  const project = useProject();
  const [nextStep, setNextStep] = useState<boolean>(false);
  const [providerApiKey, setProviderApiKey] = useState<string | null>(null);
  const apiKey = useApiKey();

  useEffect(() => {
    if (provider && api && nextStep && providerApiKey != null) {
      const req: GenerateConnectionRequest = {
        projectId: project.projectId,
        groupName,
        groupRef,
        consumerName,
        consumerRef,
        provider,
        apiKey: providerApiKey,
      };

      api().connectionApi.generateConnection({ projectIdOrName: project.projectId, generateConnectionParams: req }, {
        headers: { 'X-Api-Key': apiKey ?? '', 'Content-Type': 'application/json' },
      }).then((conn) => {
        setSelectedConnection(conn);
      }).catch((err) => {
        console.error('Error loading provider info: ', err);
      });
    }
  }, [apiKey, provider, nextStep, consumerName, consumerRef, groupName, groupRef,
    project, setSelectedConnection, providerApiKey]);

  const onNext = (value: string) => {
    setProviderApiKey(value);
    setNextStep(true);
  };

  if (selectedConnection === null) {
    return <LandingContent provider={provider} handleSubmit={onNext} error={null} />;
  }

  return children;
}
