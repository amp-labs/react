import { useProject } from 'context/ProjectContextProvider';
import { useProvider } from 'src/hooks/useProvider';
import { Connection } from 'src/services/api';

import { SuccessTextBox } from '../SuccessTextBox/SuccessTextBox';

import { SHOW_UPDATE_CONNECTION } from './contant';
import { ManageConnectionSection } from './ManageConnectionSection';
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
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%',
      }}
      >
        <ManageConnectionSection
          resetComponent={resetComponent}
          onDisconnectSuccess={onDisconnectSuccess}
          provider={provider}
        />
        {/* TODO: remove this once the update connection section is implemented */}
        {!SHOW_UPDATE_CONNECTION && (
        <RemoveConnectionButton
          resetComponent={resetComponent}
          onDisconnectSuccess={onDisconnectSuccess}
          buttonText="Remove connection"
          buttonVariant="danger"
          buttonStyle={{ fontSize: '13px' }}
        />
        )}
      </div>
    </SuccessTextBox>
  );
}
