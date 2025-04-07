import { Integration, ProviderInfo } from '../services/api';

/**
 * Get the value of an environment variable or return a default value safely
 * solves issue of process.env not being available in some environments
 * @param varName
 * @param defaultValue
 * @returns
 */
export function getEnvVariable(varName: string, defaultValue?: string | boolean | undefined) {
  try {
    return process.env[varName];
  } catch (e) {
    return defaultValue;
  }
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// use useProvider hook instead when possible to get provider name
// this util function fetches the provider name from the provider info object
export function getProviderName(provider: string, providerInfo: ProviderInfo) {
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

/**
 * Escapes ., /, \ and : in object names.
 * This is used to escape object names that have special characters for the update mask.
 */
export const escapeObjectName = (objectName: string) => objectName.replace(/[.:/\\]/g, '\\$&');
