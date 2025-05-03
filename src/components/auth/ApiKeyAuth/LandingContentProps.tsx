import { MetadataItemInput, ProviderInfo } from "@generated/api/src";

export type LandingContentProps = {
  provider: string;
  providerInfo: ProviderInfo;
  handleSubmit: (form: IFormType) => void;
  error: string | null;
  isButtonDisabled?: boolean;
  requiredProviderMetadata?: MetadataItemInput[];
};

export interface IFormType {
  apiKey: string;
  providerMetadata?: Record<string, string>;
}
