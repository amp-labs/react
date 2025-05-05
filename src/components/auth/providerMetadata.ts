import { MetadataItemInput, ProviderMetadataInfo } from "@generated/api/src";

export type ProviderMetadata = Record<string, ProviderMetadataInfo>;

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

export function isProviderMetadataValid(
  metadataFields: MetadataItemInput[],
  formData: Record<string, string>,
): boolean {
  return metadataFields.every((item: MetadataItemInput) => {
    const value = formData[item.name];
    return value && value.trim() !== "";
  });
}
