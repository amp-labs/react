import { MetadataItemInput, ProviderMetadataInfo } from "@generated/api/src";

export type ProviderMetadata = Record<string, ProviderMetadataInfo>;

/**
 * Get the required metadata for the provider from the form data.
 * @param metadataFields - The metadata required by the provider.
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
 * @param metadataFields - The metadata required by the provider.
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
