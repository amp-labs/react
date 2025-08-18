import type {
  ConfigContent,
  UpdateInstallationConfigContent,
} from "@generated/api/src";

/**
 * Bridge type for config content that can be used for both creation and updates.
 * This type makes all fields optional to match UpdateInstallationConfigContent,
 * but when used for creation, the provider field should be provided.
 */
type InstallationConfigContent = Partial<ConfigContent>;

/**
 * Type guard to check if a config content has the required fields for creation
 */
export function isValidCreateConfig(
  config: InstallationConfigContent,
): config is ConfigContent {
  return typeof config.provider === "string";
}

/**
 * Helper to convert InstallationConfigContent to UpdateInstallationConfigContent
 */
export function toUpdateConfigContent(
  config: InstallationConfigContent,
): UpdateInstallationConfigContent {
  return config;
}

/**
 * Helper to convert InstallationConfigContent to ConfigContent
 * Throws error if required fields are missing
 */
export function toCreateConfigContent(
  config: InstallationConfigContent,
): ConfigContent {
  if (!isValidCreateConfig(config)) {
    throw new Error("Config must have a provider field for creation");
  }
  return config;
}

/**
 * Type guard to safely convert UpdateInstallationConfigContent to InstallationConfigContent
 */
export function toInstallationConfigContentFromUpdate(
  config: UpdateInstallationConfigContent,
): config is InstallationConfigContent {
  return config !== null && config !== undefined;
}

export type { InstallationConfigContent };
