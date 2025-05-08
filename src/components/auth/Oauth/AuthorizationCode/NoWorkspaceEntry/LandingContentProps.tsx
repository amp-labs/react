export type LandingContentProps = {
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  error: string | null;
  isButtonDisabled?: boolean;
  providerName?: string;
};
