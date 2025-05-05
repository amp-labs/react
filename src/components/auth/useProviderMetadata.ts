import { MetadataItemInput, ProviderMetadataInfo } from "@generated/api/src";

export function getProviderMetadata(
  formData: Record<string, string>,
  requiredProviderMetadata: MetadataItemInput[],
): { providerMetadata: Record<string, ProviderMetadataInfo> } | { error: string } {
  const metadata: Record<string, ProviderMetadataInfo> = {};
  const missingFields: string[] = [];

  requiredProviderMetadata.forEach((item) => {
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
    return {
      error: `Please fill in the following required fields: ${missingFields.join(", ")}.`,
    };
  }

  return { providerMetadata: metadata };
}

export function isProviderMetadataValid(
  formData: Record<string, string>,
  requiredProviderMetadata: MetadataItemInput[],
): boolean {
  return requiredProviderMetadata.every((item) => {
    const value = formData[item.name];
    return value && value.trim() !== "";
  });
}
