import { useEffect, useState } from 'react';
import { GenerateConnectionRequest } from '@generated/api/src';

import { LandingContent } from 'components/NoAuth/NoAuthFlow/LandingContent';
import { useApiKey } from 'context/ApiKeyContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import { api, Connection } from 'services/api';

type NoAuthFlowProps = {
  provider: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  children: JSX.Element,
  selectedConnection: Connection | null;
  setSelectedConnection: (connection: Connection | null) => void;
};

export function NoAuthFlow({
  provider, consumerRef, consumerName, groupRef, groupName, children, selectedConnection, setSelectedConnection,
}: NoAuthFlowProps) {
  const project = useProject();
  const apiKey = useApiKey();
  const [nextStep, setNextStep] = useState<boolean>(false);

  useEffect(() => {
    if (provider && api && nextStep) {
      const req: GenerateConnectionRequest = {
        projectId: project.projectId,
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
        console.error('Error loading provider info: ', err);
      });
    }
  }, [apiKey, provider, nextStep, consumerName, consumerRef, groupName, groupRef, project]);

  const onNext = () => {
    setNextStep(true);
  };

  if (selectedConnection === null) {
    return <LandingContent provider={provider} handleSubmit={onNext} error={null} />;
  }

  return children;
}
