import { useProject } from 'context/ProjectContextProvider';
import { useProvider } from 'src/hooks/useProvider';
import { Connection } from 'src/services/api';

import { SuccessTextBox } from '../SuccessTextBox/SuccessTextBox';

import { RemoveConnectionButton } from './RemoveConnectionButton';

interface ConnectedSuccessBoxProps {
  resetComponent: () => void; // reset the ConnectProvider component
  provider: string;
  onDisconnectSuccess?: (connection: Connection) => void;
}
export function ConnectedSuccessBox({ provider, onDisconnectSuccess, resetComponent }: ConnectedSuccessBoxProps) {
  const { appName } = useProject();
  const { providerName } = useProvider(provider);
  const text = `You have successfully connected your ${providerName} account to ${appName}.`;
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
