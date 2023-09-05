import { useEffect, useState } from 'react';

import { useProjectID } from '../../hooks/useProjectID';
import { api, Installation } from '../../services/api';

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
  const [installations, setInstallations] = useState<Installation[]>([]);
  // check if integration has been installed
  useEffect(() => {
    // check if installation exists
    api.listInstallations({ projectId: projectID, integrationId: integration, groupRef })
      .then((res) => { setInstallations(res.installations || []); })
      .catch((err) => { console.error(err); });
  }, []);

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
