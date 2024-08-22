import { SuccessTextBox } from 'components/SuccessTextBox';
import { getProviderName } from 'src/utils';

type InstalledSuccessBoxProps = {
  provider: string;
};

export function InstalledSuccessBox({ provider }: InstalledSuccessBoxProps) {
  const text = `You have successfully installed your ${getProviderName(provider)} integration.`;
  return (
    <SuccessTextBox text={text} />
  );
}
