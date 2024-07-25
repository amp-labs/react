import { useEffect, useState } from 'react';
import { GenerateConnectionRequest } from '@generated/api/src';

import { LandingContent } from 'components/BasicAuth/BasicAuthFlow/LandingContent';
import { useApiKey } from 'context/ApiKeyContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import { api, Connection } from 'services/api';

type BasicAuthFlowProps = {
  provider: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  children: JSX.Element,
  setSelectedConnection: (connection: Connection) => void;
};

type BasicCreds = {
  user: string;
  pass: string;
};

export function BasicAuthFlow({
  provider, consumerRef, consumerName, groupRef, groupName, children, setSelectedConnection,
}: BasicAuthFlowProps) {
  const project = useProject();
  const [connection, setConnection] = useState<Connection | null>(null);
  const [nextStep, setNextStep] = useState<boolean>(false);
  const [creds, setCreds] = useState<BasicCreds | null>(null);
  const apiKey = useApiKey();

  useEffect(() => {
    if (provider && api && nextStep && creds != null) {
      const req: GenerateConnectionRequest = {
        projectId: project.projectId,
        groupName,
        groupRef,
        consumerName,
        consumerRef,
        provider,
        basicAuth: {
          username: creds.user,
          password: creds.pass,
        },
      };

      api().connectionApi.generateConnection({ projectIdOrName: project.projectId, generateConnectionParams: req }, {
        headers: { 'X-Api-Key': apiKey ?? '', 'Content-Type': 'application/json' },
      }).then((conn) => {
        setConnection(conn);
      }).catch((err) => {
        console.error('Error loading provider info: ', err);
      });
    }
  }, [apiKey, provider, nextStep, consumerName, consumerRef, groupName, groupRef, project]);

  const onNext = (user: string, pass: string) => {
    setCreds({ user, pass });
    setNextStep(true);
  };

  if (connection === null) {
    return <LandingContent provider={provider} handleSubmit={onNext} error={null} />;
  }

  setSelectedConnection(connection);
  return children;
}
