import { useListIntegrationsQuery } from './useIntegrationListQuery';

/**
 * get integration by id
 * @param integrationId
 * @returns
 */
export const useIntegrationQuery = (integrationId: string) => {
  // TODO: replace with getIntegration endpoint
  const integrationsQuery = useListIntegrationsQuery();
  const integrations = integrationsQuery.data;

  const integration = integrations?.find((_integration) => _integration.id === integrationId);

  return {
    ...integrationsQuery,
    data: integration, // override data to be the integration object
    provider: integration?.provider,
  };
};
