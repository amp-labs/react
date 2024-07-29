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
  setSelectedConnection: (connection: Connection) => void;
};

export function ApiKeyAuthFlow({
  provider, consumerRef, consumerName, groupRef, groupName, children, setSelectedConnection,
}: ApiKeyAuthFlowProps) {
  const project = useProject();
  const [connection, setConnection] = useState<Connection | null>(null);
  const [nextStep, setNextStep] = useState<boolean>(false);
  const [userApiKey, setUserApiKey] = useState<string | null>(null);
  const apiKey = useApiKey();

  useEffect(() => {
    if (provider && api && nextStep && userApiKey != null) {
      const req: GenerateConnectionRequest = {
        projectId: project.projectId,
        groupName,
        groupRef,
        consumerName,
        consumerRef,
        provider,
        apiKey: userApiKey,
      };

      api().connectionApi.generateConnection({ projectIdOrName: project.projectId, generateConnectionParams: req }, {
        headers: { 'X-Api-Key': apiKey ?? '', 'Content-Type': 'application/json' },
      }).then((conn) => {
        setConnection(conn);
      }).catch((err) => {
        console.error('Error loading provider info: ', err);
      });
    }
  }, [apiKey, provider, nextStep, consumerName, consumerRef, groupName, groupRef, project, userApiKey]);

  const onNext = (value: string) => {
    setUserApiKey(value);
    setNextStep(true);
  };

  if (connection === null) {
    return <LandingContent provider={provider} handleSubmit={onNext} error={null} />;
  }

  setSelectedConnection(connection);
  return children;
}