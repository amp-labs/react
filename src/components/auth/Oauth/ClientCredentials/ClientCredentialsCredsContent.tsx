import { ProviderMetadataInfo } from "@generated/api/src";

export type ClientCredentialsCredsContent = {
  clientId: string;
  clientSecret: string;
  scopes?: string[];
  providerMetadata?: Record<string, ProviderMetadataInfo>;
};
