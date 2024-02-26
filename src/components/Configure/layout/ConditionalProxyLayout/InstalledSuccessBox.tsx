import { capitalize } from '../../../../utils';
import { SuccessTextBox } from '../../../SuccessTextBox';

type InstalledSuccessBoxProps = {
  provider: string;
};

export function InstalledSuccessBox({ provider }: InstalledSuccessBoxProps) {
  const text = `You have successfully installed your ${capitalize(provider)} integration.`;
  return (
    <SuccessTextBox text={text} />
  );
}
