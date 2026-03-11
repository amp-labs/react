import {
  Connection,
  MetadataItemInput,
  ProviderInfo,
  ProviderMetadataInfo,
} from "@generated/api/src";

export type ProviderMetadata = Record<string, ProviderMetadataInfo>;

/**
 * Get the required metadata for the provider from the form data.
 * @param metadataInputs - The metadata required by the provider. Is defined in the provider info.
 * @param formData - The form data to get the metadata from.
 * @returns Metadata that can be sent over the API.
 */
export function getProviderMetadata(
  metadataInputs: MetadataItemInput[],
  formData: Record<string, string>,
): ProviderMetadata {
  const metadata: ProviderMetadata = {};
  const missingFields: string[] = [];

  metadataInputs.forEach((item: MetadataItemInput) => {
    const value = formData[item.name];
    if (!value || value.trim() === "") {
      missingFields.push(item.displayName || item.name);
    } else {
      metadata[item.name] = {
        value,
        source: "input",
      };
    }
  });

  if (missingFields.length > 0) {
    throw new Error(
      `Please fill in the following required fields: ${missingFields.join(", ")}.`,
    );
  }

  return metadata;
}

/**
 * Check if the required metadata for the provider has been filled in.
 * This will be more useful when we have required/optional metadata later on.
 * @param metadataInputs - The metadata required by the provider. Is defined in the provider info.
 * @param formData - The form data to check the metadata against.
 * @returns True if all required metadata has been filled in, false otherwise.
 */
export function isProviderMetadataValid(
  metadataInputs: MetadataItemInput[],
  formData: Record<string, string>,
): boolean {
  return metadataInputs.every((item: MetadataItemInput) => {
    const value = formData[item.name];
    return value && value.trim() !== "";
  });
}

/**
 * Determines which module to use for filtering metadata fields.
 *
 * Logic:
 * 1. If provider has no modules (providerInfo.modules is empty/undefined) → return { module: "", error: null }
 * 2. If provider has modules:
 *    a. Use integrationModule if provided
 *    b. Fall back to providerInfo.defaultModule
 *    c. If neither exists, return error message instead of throwing
 *
 * @param integrationModule - Module specified on the integration/revision
 * @param providerInfo - Provider information containing modules and defaultModule
 * @returns Object with module string (or "") and optional error message
 */
export function determineModule(
  integrationModule: string | undefined,
  providerInfo: ProviderInfo | null | undefined,
): { module: string; error: string | null } {
  // Check if provider has any modules defined
  const providerModules = providerInfo?.modules;
  const hasModules = providerModules && Object.keys(providerModules).length > 0;

  // If provider has no modules, return empty string to indicate "no modules"
  // This means all metadata fields should be shown
  if (!hasModules) {
    return { module: "", error: null };
  }

  // Provider has modules - determine which one to use
  const moduleToUse = integrationModule || providerInfo.defaultModule;

  // If we still don't have a module, this is an error condition
  // Provider has modules but integration didn't specify one and there's no default
  if (!moduleToUse) {
    return {
      module: "",
      error: `Could not determine module for provider ${providerInfo?.name}`,
    };
  }

  return { module: moduleToUse, error: null };
}

/**
 * Filter metadata fields based on module dependencies.
 * Only returns fields that either:
 * 1. Module is "" (empty string = provider has no modules) → return all fields
 * 2. Field has no moduleDependencies (apply to all modules) → include field
 * 3. Field has the module in their moduleDependencies (case-insensitive) → include field
 *
 * @param metadataInputs - All metadata fields from provider info
 * @param module - The module determined by determineModule() ("" means no modules, show all)
 * @returns Filtered array of metadata fields applicable to this module
 */
export function filterMetadataByModule(
  metadataInputs: MetadataItemInput[],
  module: string,
): MetadataItemInput[] {
  // Empty string means provider has no modules at all - return all fields
  if (module === "") {
    return metadataInputs;
  }

  const moduleLowerCase = module.toLowerCase();

  return metadataInputs.filter((field) => {
    // If field has no module dependencies, it applies to all modules
    if (!field.moduleDependencies) {
      return true;
    }

    // Check if this module is in the field's dependencies (case-insensitive)
    return Object.keys(field.moduleDependencies).some(
      (key) => key.toLowerCase() === moduleLowerCase,
    );
  });
}

/**
 * Checks if a connection is missing any metadata fields required by the module.
 *
 * @param connection - The existing connection to check
 * @param requiredMetadataFields - The metadata fields required for this module
 * @returns true if the connection is missing one or more required metadata fields
 */
export function isConnectionMissingModuleMetadata(
  connection: Connection,
  requiredMetadataFields: MetadataItemInput[],
): boolean {
  if (requiredMetadataFields.length === 0) {
    return false;
  }

  const existingMetadata = connection.providerMetadata || {};

  return requiredMetadataFields.some((field) => {
    const existing = existingMetadata[field.name];
    return !existing || !existing.value || existing.value.trim() === "";
  });
}

/**
 * Validates that a module prop is a valid module for the given provider.
 *
 * @param moduleProp - The module string to validate
 * @param providerInfo - Provider information containing available modules
 * @returns Error message if invalid, null if valid
 */
export function validateModuleProp(
  moduleProp: string | undefined,
  providerInfo: ProviderInfo | null | undefined,
): string | null {
  if (!moduleProp || !providerInfo) {
    return null;
  }

  const providerModules = providerInfo.modules;
  const hasModules = providerModules && Object.keys(providerModules).length > 0;

  if (!hasModules) {
    // Provider has no modules, module prop is ignored
    return null;
  }

  // Case-insensitive lookup
  const validModule = Object.keys(providerModules).some(
    (key) => key.toLowerCase() === moduleProp.toLowerCase(),
  );

  if (!validModule) {
    const validModules = Object.keys(providerModules).join(", ");
    return (
      `Invalid module "${moduleProp}" for provider ` +
      `${providerInfo.name}. Valid modules: ${validModules}`
    );
  }

  return null;
}
