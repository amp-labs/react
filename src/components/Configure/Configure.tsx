/**
 * TODO delete this page
 */
import { useEffect, useState } from 'react';

import { getListConnections } from '../../services/apiService';
import { IntegrationConfig } from '../../types/configTypes';

import { ConfigureIntegrationBase } from './ConfigureIntegrationBase';

interface ReconfigureIntegrationProps {
  integration: string,
  userId: string,
  groupId: string,
  redirectUrl?: string,
}
export function ReconfigureIntegration(
  {
    integration, userId, groupId, redirectUrl,
  }: ReconfigureIntegrationProps,
) {
  const [userConfig, setUserConfig] = useState<IntegrationConfig | undefined>(undefined);

  // GET USER'S EXISTING CONFIG IF EXISTING
  useEffect(() => {
    getListConnections(userId, groupId, integration)
      .then((config) => setUserConfig(config));
  }, [userId, groupId, integration]);

  return (
    <ConfigureIntegrationBase
      integration={integration}
      userId={userId}
      groupId={groupId}
      userConfig={userConfig}
      redirectUrl={redirectUrl}
    />
  );
}
