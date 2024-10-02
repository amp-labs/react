import { ProviderInfo } from '@generated/api/src';

export type LandingContentProps = {
  provider: string;
  providerInfo: ProviderInfo;
  handleSubmit: (form: any) => void;
  error: string | null;
  isButtonDisabled?: boolean;
};
