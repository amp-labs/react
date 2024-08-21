import { Integration, ProviderInfo } from '../services/api';

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getProviderName(provider: string, providerInfo?: ProviderInfo) {
  return providerInfo?.displayName ?? capitalize(provider);
}

/**
 * Converts a textarea input into an array of strings
 */
export const convertTextareaToArray = (inputValue: string) => {
  // Split the input into an array of strings using newline as the separator
  const newArray = inputValue.split('\n').filter((str) => str.trim() !== '');
  return newArray;
};

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
