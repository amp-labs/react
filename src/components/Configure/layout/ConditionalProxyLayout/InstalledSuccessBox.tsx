import { SuccessTextBox } from 'components/SuccessTextBox/SuccessTextBox';
import { getProviderName } from 'src/utils';

import { UninstallButton } from '../UninstallButton';

type InstalledSuccessBoxProps = {
  provider: string;
};

export function InstalledSuccessBox({ provider }: InstalledSuccessBoxProps) {
  const text = `You have successfully installed your ${getProviderName(
    provider,
  )} integration.`;
  return (
    <SuccessTextBox text={text}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <UninstallButton
          buttonText="Uninstall"
          buttonVariant="outline"
          buttonStyle={{ fontSize: '13px' }}
        />
      </div>
    </SuccessTextBox>
  );
}
