import { useState } from "react";
import { MetadataItemInput } from "@generated/api/src";

export function useProviderMetadata(
  formData: Record<string, string>,
  requiredProviderMetadata: MetadataItemInput[],
) {
  const [error, setError] = useState<string | null>(null);

  const getProviderMetadata = () => {
    const metadata: Record<string, string> = {};
    const missingFields: string[] = [];

    requiredProviderMetadata.forEach((item) => {
      const value = formData[item.name];
      if (!value || value.trim() === "") {
        missingFields.push(item.name);
      } else {
        metadata[item.name] = value;
      }
    });

    if (missingFields.length > 0) {
      setError(`Please fill in the following required fields: ${missingFields.join(", ")}.`);
      return undefined;
    }
    setError(null);
    return Object.keys(metadata).length
      ? { providerMetadata: metadata }
      : undefined;
  };

  return { getProviderMetadata, error, setError };
}

export function toApiProviderMetadata(
  providerMetadata: Record<string, string> | undefined,
): Record<string, { value: string; source: "input" }> | undefined {
  if (!providerMetadata) return undefined;
  const entries = Object.entries(providerMetadata).map(([name, value]) => [
    name,
    { value, source: "input" as const },
  ]);
  return entries.length ? Object.fromEntries(entries) : undefined;
}
