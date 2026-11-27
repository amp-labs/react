import { ProviderMetadataInfo } from "@generated/api/src";

/**
 * What the password grant form collects. The client ID and secret are optional:
 * providers that need none, or that have a public default client (such as
 * SugarAI's), work without them.
 */
export type PasswordGrantCreds = {
  username: string;
  password: string;
  clientId: string;
  clientSecret: string;
  scopes?: string[];
  providerMetadata?: Record<string, ProviderMetadataInfo>;
};
