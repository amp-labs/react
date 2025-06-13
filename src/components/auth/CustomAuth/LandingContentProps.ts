import { ProviderInfo } from "@generated/api/src";

import { ProviderMetadata } from "../providerMetadata";

export type CustomAuthFormData = {
  customAuth: Record<string, string>;
  providerMetadata: ProviderMetadata;
};

export type LandingContentProps = {
  providerInfo: ProviderInfo;
  handleSubmit: (form: CustomAuthFormData) => void;
  error: string | null;
  isButtonDisabled?: boolean;
};
