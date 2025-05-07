import { ProviderInfo } from "@generated/api/src";

import { ProviderMetadata } from "../providerMetadata";

export type BasicCreds = {
  user: string;
  pass: string;
  providerMetadata?: ProviderMetadata;
};

export type LandingContentProps = {
  provider: string;
  providerInfo: ProviderInfo;
  handleSubmit: (form: BasicCreds) => void;
  error: string | null;
  isButtonDisabled?: boolean;
};
