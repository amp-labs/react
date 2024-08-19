import { useEffect, useState } from 'react';
import { GenerateConnectionRequest, ProviderInfo } from '@generated/api/src';

import { LandingContent } from 'components/BasicAuth/BasicAuthFlow/LandingContent';
import { useApiKey } from 'context/ApiKeyContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import { api, Connection } from 'services/api';

type BasicAuthFlowProps = {
  provider: string;
  providerInfo: ProviderInfo;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  children: JSX.Element,
  selectedConnection: Connection | null;
  setSelectedConnection: (connection: Connection | null) => void;
};

type BasicCreds = {
  user: string;
  pass: string;
};

export function BasicAuthFlow({
  provider, providerInfo, consumerRef, consumerName, groupRef, groupName,
  children, selectedConnection, setSelectedConnection,
}: BasicAuthFlowProps) {
  const project = useProject();
  const [nextStep, setNextStep] = useState<boolean>(false);
  const [creds, setCreds] = useState<BasicCreds | null>(null);
  const apiKey = useApiKey();

  useEffect(() => {
    if (provider && api && nextStep && creds != null) {
      const req: GenerateConnectionRequest = {
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
        setSelectedConnection(conn);
      }).catch((err) => {
        console.error('Error loading provider info: ', err);
      });
    }
  }, [apiKey, provider, nextStep, consumerName, consumerRef, groupName,
    groupRef, project, creds, setSelectedConnection]);

  const onNext = (user: string, pass: string) => {
    setCreds({ user, pass });
    setNextStep(true);
  };

  if (selectedConnection === null) {
    return (
      <LandingContent
        provider={provider}
        providerInfo={providerInfo}
        handleSubmit={onNext}
        error={null}
      />
    );
  }

  return children;
}
