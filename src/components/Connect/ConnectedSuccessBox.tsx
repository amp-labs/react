import { useProject } from 'context/ProjectContextProvider';
import { getProviderName } from 'src/utils';

import { SuccessTextBox } from '../SuccessTextBox/SuccessTextBox';

import { RemoveConnectionButton } from './RemoveConnectionButton';

interface ConnectedSuccessBoxProps {
  resetComponent: () => void;
  provider: string;
  onDisconnectSuccess?: (connectionID: string) => void;
}
export function ConnectedSuccessBox({ provider, onDisconnectSuccess, resetComponent }: ConnectedSuccessBoxProps) {
  const { appName } = useProject();
  const text = `You have successfully connected your ${getProviderName(provider)} account to ${appName}.`;
  return (
    <SuccessTextBox text={text}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <RemoveConnectionButton
          resetComponent={resetComponent}
          onDisconnectSuccess={onDisconnectSuccess}
          buttonText="Remove Connection"
          buttonVariant="outline"
          buttonStyle={{ fontSize: '13px' }}
        />
      </div>
    </SuccessTextBox>
  );
}
