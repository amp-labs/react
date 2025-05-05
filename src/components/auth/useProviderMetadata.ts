import { useCallback, useState } from "react";
import { MetadataItemInput, ProviderMetadataInfo } from "@generated/api/src";

export function useProviderMetadata(
  formData: Record<string, string>,
  requiredProviderMetadata: MetadataItemInput[],
) {
  const [error, setError] = useState<string | null>(null);

  const getProviderMetadata = useCallback(() => {
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
      setError(
        `Please fill in the following required fields: ${missingFields.join(", ")}.`,
      );

      return undefined;
    }

    setError(null);
    return { providerMetadata: metadata };
  }, [formData, requiredProviderMetadata]);

  const isProviderMetadataValid = useCallback(() => {
    return requiredProviderMetadata.every((item) => {
      const value = formData[item.name];
      return value && value.trim() !== "";
    });
  }, [formData, requiredProviderMetadata]);

  return { getProviderMetadata, error, setError, isProviderMetadataValid };
}
