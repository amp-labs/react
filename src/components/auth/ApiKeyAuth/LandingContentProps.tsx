import { ProviderInfo } from "@generated/api/src";

import { ProviderMetadata } from "../providerMetadata";

export type LandingContentProps = {
  provider: string;
  providerInfo: ProviderInfo;
  handleSubmit: (form: IFormType) => void;
  error: string | null;
  isButtonDisabled?: boolean;
};

export interface IFormType {
  apiKey: string;
  providerMetadata?: ProviderMetadata;
}
