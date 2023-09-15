import { useEffect, useState } from 'react';

import { useIntegrationList } from '../../context/IntegrationListContext';
import { useProjectID } from '../../hooks/useProjectID';
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
  const projectID = useProjectID();
  const { integrations } = useIntegrationList();
  const [installations, setInstallations] = useState<Installation[]>([]);
  const integrationObj = findIntegrationFromList(integration, integrations || []);
  const installation = installations?.[0] || null;

  // check if integration has been installed in AmpersandProvider
  useEffect(() => {
    if (integrationObj) {
      // check if installation exists on selected integration
      api.listInstallations({ projectId: projectID, integrationId: integrationObj.id, groupRef })
        .then((_installations) => { setInstallations(_installations || []); })
        .catch((err) => { console.error('ERROR: ', err); });
    }
  }, [integrationObj?.id]);

  return installation && integrationObj ? (
    <ReconfigureIntegration
      installation={installation}
      integrationObj={integrationObj}
    />
  ) : (
    <ConfigureIntegrationBase
      integration={integration}
      userId={consumerRef}
      groupId={groupRef}
    />
  );
}
