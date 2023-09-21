import { useEffect, useState } from 'react';

import { HydratedRevisionProvider } from '../../context/HydratedRevisionContext';
import { useIntegrationList } from '../../context/IntegrationListContext';
import { useProject } from '../../context/ProjectContext';
import { api, Installation } from '../../services/api';
import { findIntegrationFromList } from '../../utils';

import { ConfigureIntegrationBase } from './ConfigureIntegrationBase';
import { ReconfigureIntegration } from './ReconfigureIntegration';

interface InstallIntegrationProps {
  integration: string, // integration name
  consumerRef: string,
  consumerName: string,
  groupRef: string,
  groupName: string,
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
  const integrationObj = findIntegrationFromList(integration, integrations || []);
  const installation = installations?.[0] || null;

  // check if integration has been installed in AmpersandProvider
  useEffect(() => {
    if (projectId && integrationObj?.id) {
      // check if installation exists on selected integration
      api.listInstallations({ projectId, integrationId: integrationObj.id, groupRef })
        .then((_installations) => { setInstallations(_installations || []); })
        .catch((err) => { console.error('ERROR: ', err); });
    }
  }, [projectId, integrationObj?.id]);

  const content = installation && integrationObj ? (
  // if installation exists, render update integration flow
    <ReconfigureIntegration
      installation={installation}
      integrationObj={integrationObj}
    />
  ) : (
    // no installation, render create integration flow
    <ConfigureIntegrationBase
      integration={integration}
      userId={consumerRef}
      groupId={groupRef}
    />
  );

  return (
    <HydratedRevisionProvider
      projectId={projectId}
      integrationId={integrationObj?.id}
      revisionId={integrationObj?.latestRevision?.id}
      connectionId={installation?.connection?.id}
    >
      {content}
    </HydratedRevisionProvider>
  );
}
