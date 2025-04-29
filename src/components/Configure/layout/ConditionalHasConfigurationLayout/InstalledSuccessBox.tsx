import { useProvider } from 'src/hooks/useProvider';

import { SuccessTextBox } from 'components/SuccessTextBox/SuccessTextBox';

import { UninstallButton } from '../UninstallButton';

type InstalledSuccessBoxProps = {
  provider: string;
};

export function InstalledSuccessBox({ provider }: InstalledSuccessBoxProps) {
  const { providerName } = useProvider(provider);
  const text = `You have successfully installed your ${providerName} integration.`;
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
