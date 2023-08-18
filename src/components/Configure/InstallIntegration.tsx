import { useEffect } from 'react';

import { useProjectID } from '../../hooks/useProjectId';
import { getListConnections } from '../../services/apiService';

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
  // check if integration has been installed
  useEffect(() => {
    // call list
    getListConnections(projectID, consumerRef, groupRef).then((res) => {
      console.log({ res });
    });
  }, []);

  return (
    <ConfigureIntegrationBase
      integration={integration}
      userId={consumerRef}
      groupId={groupRef}
    />
  );
}
