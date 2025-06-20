import { Integration, ProviderInfo } from "../services/api";

/**
 * Get the value of an environment variable or return a default value safely
 * solves issue of process.env not being available in some environments
 * @param varName
 * @param defaultValue
 * @returns
 */
export function getEnvVariable(
  varName: string,
  defaultValue?: string | boolean | undefined,
) {
  try {
    return process.env[varName];
  } catch {
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
  const newArray = inputValue.split("\n").filter((str) => str.trim() !== "");
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
): Integration | null => {
  if (integrations?.length === 0 || !integrationName) return null;

  return (
    integrations.find((s: Integration) => s.name === integrationName) ?? null
  );
};

/**
 * Escapes ., /, \ and : in object names.
 * This is used to escape object names that have special characters for the update mask.
 */
export const escapeObjectName = (objectName: string) =>
  objectName.replace(/[.:/\\]/g, "\\$&");

/**
 * Sanitizes a string to be used as a safe HTML ID attribute.
 * Ensures the ID follows HTML ID naming conventions and is safe for rendering.
 *
 * @param id - The string to sanitize
 * @returns A sanitized string safe for use as an HTML ID
 */
export function sanitizeHtmlId(id: string) {
  if (!id || typeof id !== "string") {
    return "id_" + Math.random().toString(36).substr(2, 9);
  }

  return (
    id
      // Convert to lowercase
      .toLowerCase()
      // Replace spaces and special chars with hyphens
      .replace(/[^a-z0-9_-]/g, "-")
      // Remove multiple consecutive hyphens
      .replace(/-+/g, "-")
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, "")
      // Ensure it starts with a letter
      .replace(/^[^a-z]/, "id-")
      // Limit length
      .substring(0, 50)
  );
}
