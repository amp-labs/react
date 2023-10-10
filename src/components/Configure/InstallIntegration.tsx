import {
  useContext, useEffect, useMemo, useState,
} from 'react';

import { ApiKeyContext } from '../../context/ApiKeyContext';
import { ConnectionsProvider } from '../../context/ConnectionsContext';
import { HydratedRevisionProvider } from '../../context/HydratedRevisionContext';
import { useIntegrationList } from '../../context/IntegrationListContext';
import { useProject } from '../../context/ProjectContext';
import { api, Installation } from '../../services/api';
import { findIntegrationFromList } from '../../utils';

import { ConfigurationProvider } from './state/ConfigurationStateProvider';
import { CreateInstallation } from './CreateInstallation';
import { ErrorTextBoxPlaceholder } from './ErrorTextBoxPlaceholder';
import { ObjectManagementNav } from './ObjectManagementNav';
import { ProtectedConnectionLayout } from './ProtectedConnectionLayout';
import { UpdateInstallation } from './UpdateInstallation';

interface InstallIntegrationProps {
  integration: string, // integration name
  consumerRef: string,
  consumerName?: string,
  groupRef: string,
  groupName?: string,
}

// TODO consider creating an integration obj context
export function InstallIntegration(
  {
    integration, consumerRef, consumerName, groupRef, groupName,
  }: InstallIntegrationProps,
) {
  const { projectId } = useProject();
  const { integrations } = useIntegrationList();
  const [installations, setInstallations] = useState<Installation[]>([]);
  const installation = installations?.[0] || null;
  const apiKey = useContext(ApiKeyContext);

  const integrationObj = useMemo(
    () => findIntegrationFromList(integration, integrations || []),
    [integration, integrations],
  );

  // check if integration has been installed in AmpersandProvider
  useEffect(() => {
    if (integrationObj?.id) {
      // check if installation exists on selected integration
      api().listInstallations({ projectId, integrationId: integrationObj.id, groupRef }, {
        headers: {
          'X-Api-Key': apiKey ?? '',
        },
      })
        .then((_installations) => { setInstallations(_installations || []); })
        .catch((err) => { console.error('ERROR: ', err); });
    }
  }, [projectId, integrationObj?.id, apiKey, groupRef]);

  // if no integration, render error page
  if (!integrations || !integrations.length || !integration || !integrationObj) {
    return <ErrorTextBoxPlaceholder />;
  }

  const content = installation && integrationObj ? (
  // if installation exists, render update installation flow
    <UpdateInstallation
      installation={installation}
      integrationObj={integrationObj}
    />
  ) : (
    // no installation, render create installation flow
    <CreateInstallation />
  );

  return (
    <ConnectionsProvider
      projectId={projectId}
      groupRef={groupRef}
      provider={integrationObj?.provider}
    >
      <ProtectedConnectionLayout
        consumerRef={consumerRef}
        consumerName={consumerName}
        groupRef={groupRef}
        groupName={groupName}
      >
        <HydratedRevisionProvider
          projectId={projectId}
          integrationId={integrationObj?.id}
          revisionId={integrationObj?.latestRevision?.id}
        >
          <ObjectManagementNav config={installation?.config}>
            <ConfigurationProvider config={installation?.config}>
              {content}
            </ConfigurationProvider>
          </ObjectManagementNav>
        </HydratedRevisionProvider>
      </ProtectedConnectionLayout>
    </ConnectionsProvider>

  );
}
