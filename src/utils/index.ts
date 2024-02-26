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
/**
 * given two list of keys,
 * return true if any of keys1 are found in keys2
 * @param keys1 string[]
 * @param keys2 string[]
 * @returns boolean
 */
export function hasKeys(keys1: string[], keys2: string[]): boolean {
  return keys1.find((key) => keys2.includes(key)) !== undefined;
}
