import { useEffect, useState } from 'react';
import { GenerateConnectionRequest } from '@generated/api/src';

import { useApiKey } from 'context/ApiKeyContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import { api } from 'services/api';
import { handleServerError } from 'src/utils/handleServerError';

import { BasicAuthContent } from './BasicAuthContent';
import { BasicAuthFlowProps } from './BasicAuthFlowProps';
import { BasicCreds } from './LandingContentProps';

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
        console.error('Error loading provider info.');
        handleServerError(err);
      });
    }
  }, [apiKey, provider, nextStep, consumerName, consumerRef, groupName,
    groupRef, project, creds, setSelectedConnection]);

  const onNext = (form: BasicCreds) => {
    const { user, pass } = form;
    setCreds({ user, pass });
    setNextStep(true);
  };

  if (selectedConnection === null) {
    return (
      <BasicAuthContent
        provider={provider}
        providerInfo={providerInfo}
        handleSubmit={onNext}
        error={null}
      />
    );
  }

  return children;
}
