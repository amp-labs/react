import { SuccessTextBox } from 'components/SuccessTextBox';
import { capitalize } from 'src/utils';

type InstalledSuccessBoxProps = {
  provider: string;
};

export function InstalledSuccessBox({ provider }: InstalledSuccessBoxProps) {
  const text = `You have successfully installed your ${capitalize(provider)} integration.`;
  return (
    <SuccessTextBox text={text} />
  );
}
