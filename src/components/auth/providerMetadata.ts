import {
  MetadataItemInput,
  ProviderInfo,
  ProviderMetadataInfo,
} from "@generated/api/src";

export type ProviderMetadata = Record<string, ProviderMetadataInfo>;

/**
 * Get the required metadata for the provider from the form data.
 * @param metadataFields - The metadata required by the provider. Is defined in the provider info.
 * @param formData - The form data to get the metadata from.
 * @returns Metadata that can be sent over the API.
 */
export function getProviderMetadata(
  metadataFields: MetadataItemInput[],
  formData: Record<string, string>,
): ProviderMetadata {
  const metadata: ProviderMetadata = {};
  const missingFields: string[] = [];

  metadataFields.forEach((item: MetadataItemInput) => {
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
 * @param metadataFields - The metadata required by the provider. Is defined in the provider info.
 * @param formData - The form data to check the metadata against.
 * @returns True if all required metadata has been filled in, false otherwise.
 */
export function isProviderMetadataValid(
  metadataFields: MetadataItemInput[],
  formData: Record<string, string>,
): boolean {
  return metadataFields.every((item: MetadataItemInput) => {
    const value = formData[item.name];
    return value && value.trim() !== "";
  });
}

/**
 * Determines which module to use for filtering metadata fields.
 *
 * Logic:
 * 1. If provider has no modules (providerInfo.modules is empty/undefined) → return "" (empty string means no modules)
 * 2. If provider has modules:
 *    a. Use integrationModule if provided
 *    b. Fall back to providerInfo.defaultModule
 *    c. If neither exists, throw an error (provider has modules but no valid module determined)
 *
 * @param integrationModule - Module specified on the integration/revision
 * @param providerInfo - Provider information containing modules and defaultModule
 * @returns Module string to use for filtering, or "" if provider has no modules
 * @throws Error if provider has modules but no valid module can be determined
 */
export function determineModule(
  integrationModule: string | undefined,
  providerInfo: ProviderInfo | null | undefined,
): string {
  // Check if provider has any modules defined
  const providerModules = providerInfo?.modules;
  const hasModules =
    providerModules && Object.keys(providerModules).length > 0;

  // If provider has no modules, return empty string to indicate "no modules"
  // This means all metadata fields should be shown
  if (!hasModules) {
    return "";
  }

  // Provider has modules - determine which one to use
  const moduleToUse = integrationModule || providerInfo.defaultModule;

  // If we still don't have a module, this is an error condition
  // Provider has modules but integration didn't specify one and there's no default
  if (!moduleToUse) {
    throw new Error(
      `Provider "${providerInfo?.name}" has modules but no valid module could be determined. ` +
        `Integration must specify a module or provider must have a defaultModule.`,
    );
  }

  return moduleToUse;
}

/**
 * Filter metadata fields based on module dependencies.
 * Only returns fields that either:
 * 1. Module is "" (empty string = provider has no modules) → return all fields
 * 2. Field has no moduleDependencies (apply to all modules) → include field
 * 3. Field has the module in their moduleDependencies (case-insensitive) → include field
 *
 * @param metadataFields - All metadata fields from provider info
 * @param module - The module determined by determineModule() ("" means no modules, show all)
 * @returns Filtered array of metadata fields applicable to this module
 */
export function filterMetadataByModule(
  metadataFields: MetadataItemInput[],
  module: string,
): MetadataItemInput[] {
  // Empty string means provider has no modules at all - return all fields
  if (module === "") {
    return metadataFields;
  }

  const moduleLowerCase = module.toLowerCase();

  return metadataFields.filter((field) => {
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
