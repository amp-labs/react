import { useEffect, useState } from 'react';

import { useIntegrationList } from '../../context/IntegrationListContext';
import { useProjectID } from '../../hooks/useProjectID';
import { api, Installation } from '../../services/api';
import { findIntegrationFromList } from '../../utils';

import { ReconfigureIntegration } from './Configure';
import { ConfigureIntegrationBase } from './ConfigureIntegrationBase';

interface InstallIntegrationProps {
  integration: string,
  consumerRef: string,
  consumerName: string,
  groupRef: string,
  groupName: string,
}

export function InstallIntegration(
  {
    integration, consumerRef, consumerName, groupRef, groupName,
  }: InstallIntegrationProps,
) {
  const projectID = useProjectID();
  const { integrations } = useIntegrationList();
  const [installations, setInstallations] = useState<Installation[]>([]);

  const integrationObj = findIntegrationFromList(integration, integrations || []);

  // check if integration has been installed in AmpersandProvider
  useEffect(() => {
    if (integrationObj) {
      // check if installation exists on selected integration
      api.listInstallations({ projectId: projectID, integrationId: integrationObj.id, groupRef })
        .then((_installations) => {
          setInstallations(_installations || []);
        })
        .catch((err) => { console.error('ERROR: ', err); });
    }
  }, [integrationObj]);

  if (installations.length > 0) {
    // Update Installation Flow
    return (
      <ReconfigureIntegration
        integration={integration}
        userId={consumerRef}
        groupId={groupRef}
      />
    );
  }

  // New Installation Flow
  return (
    <ConfigureIntegrationBase
      integration={integration}
      userId={consumerRef}
      groupId={groupRef}
    />
  );
}
