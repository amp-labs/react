import { useState } from "react";
import { MetadataItemInput } from "@generated/api/src";

export function useProviderMetadata(
  formData: Record<string, string>,
  requiredProviderMetadata: MetadataItemInput[],
) {
  const [error, setError] = useState<string | null>(null);

  const getProviderMetadata = () => {
    const metadata: Record<string, string> = {};
    let hasEmptyFields = false;

    requiredProviderMetadata.forEach((item) => {
      const value = formData[item.name];
      if (!value || value.trim() === "") {
        hasEmptyFields = true;
      } else {
        metadata[item.name] = value;
      }
    });

    if (hasEmptyFields) {
      setError("Please fill in all required fields.");
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
