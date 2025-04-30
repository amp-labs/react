import { useListIntegrationsQuery } from "./useIntegrationListQuery";

/**
 * get integration by name or id
 * @param integrationNameOrId
 * @returns
 */
export const useIntegrationQuery = (integrationNameOrId: string) => {
  // TODO: replace with getIntegration endpoint
  const integrationsQuery = useListIntegrationsQuery();
  const integrations = integrationsQuery.data;

  const integration = integrations?.find(
    (_integration) =>
      _integration.name === integrationNameOrId || // find by name
      _integration.id === integrationNameOrId, // find by id
  );

  return {
    ...integrationsQuery,
    data: integration, // override data to be the integration object
    provider: integration?.provider,
  };
};
