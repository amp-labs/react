import { useEffect, useState } from 'react';
import { GenerateConnectionRequest } from '@generated/api/src';

import { useApiKey } from 'context/ApiKeyContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import { api, Connection } from 'services/api';
import { handleServerError } from 'src/utils/handleServerError';

import { NoAuthContent } from './NoAuthContent';

type NoAuthFlowProps = {
  provider: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  providerName?: string;
  children: JSX.Element,
  selectedConnection: Connection | null;
  setSelectedConnection: (connection: Connection | null) => void;
};

export function NoAuthFlow({
  provider, consumerRef, consumerName, groupRef, groupName,
  children, selectedConnection, setSelectedConnection, providerName,
}: NoAuthFlowProps) {
  const project = useProject();
  const apiKey = useApiKey();
  const [nextStep, setNextStep] = useState<boolean>(false);

  useEffect(() => {
    if (provider && api && nextStep) {
      const req: GenerateConnectionRequest = {
        groupName,
        groupRef,
        consumerName,
        consumerRef,
        provider,
      };

      api().connectionApi.generateConnection({ projectIdOrName: project.projectId, generateConnectionParams: req }, {
        headers: { 'X-Api-Key': apiKey ?? '', 'Content-Type': 'application/json' },
      }).then((conn) => {
        setSelectedConnection(conn);
      }).catch((err) => {
        console.error('Error loading provider info.');
        handleServerError(err);
      });
    }
  }, [apiKey, provider, nextStep, consumerName, consumerRef, groupName, groupRef, setSelectedConnection, project]);

  const onNext = () => {
    setNextStep(true);
  };

  if (selectedConnection === null) {
    return <NoAuthContent handleSubmit={onNext} error={null} providerName={providerName} />;
  }

  return children;
}
