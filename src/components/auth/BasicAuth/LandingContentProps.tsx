import { MetadataItemInput, ProviderInfo } from "@generated/api/src";

export type BasicCreds = {
  user: string;
  pass: string;
  providerMetadata?: Record<string, string>;
};

export type LandingContentProps = {
  provider: string;
  providerInfo: ProviderInfo;
  handleSubmit: (form: BasicCreds) => void;
  error: string | null;
  isButtonDisabled?: boolean;
  requiredProviderMetadata?: MetadataItemInput[];
};
