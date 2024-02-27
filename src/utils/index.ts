import { Integration } from '../services/api';

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Given the name of an integration, return the integration object
 *
 * @param integrationName {string} Name of the integration.
 * @param integrations {Integration[]} List of integrations.
 * @returns {Integration | null}
 */
export const findIntegrationFromList = (
  integrationName: string,
  integrations: Integration[],
) : Integration | null => {
  if (integrations?.length === 0 || !integrationName) return null;

  return integrations.find(
    (s: Integration) => s.name === integrationName,
  ) ?? null;
};
