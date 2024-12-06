import { ProtectedConnectionLayout } from 'components/Configure/layout/ProtectedConnectionLayout';
import { RedirectHandler } from 'components/RedirectHandler';
import { ConnectionsProvider } from 'context/ConnectionsContextProvider';
import resetStyles from 'src/styles/resetCss.module.css';

import { ConnectedSuccessBox } from './ConnectedSuccessBox';

interface ConnectProviderProps {
  provider: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  redirectUrl?: string;
  /**
   * Use `onConnectSuccess` instead of `onSuccess`. `onSuccess` will soon be deprecated.
   * @deprecated
   */
  onSuccess?: (connectionID: string) => void;
  /**
   * Callback function to be executed when a connection is successfully established.
   * @param connectionID - The ID of the newly established connection.
   */
  onConnectSuccess?: (connectionID: string) => void;
  /**
   * Callback function to be executed when a connection is successfully disconnected.
   * @param connectionID - The ID of the disconnected connection.
   */
  onDisconnectSuccess?: (connectionID: string) => void;
}

export function ConnectProvider({
  provider,
  consumerRef,
  consumerName,
  groupRef,
  groupName,
  redirectUrl,
  onSuccess,
  onDisconnectSuccess,
  onConnectSuccess,
}: ConnectProviderProps) {
  // eslint-disable-next-line no-param-reassign
  onSuccess = onConnectSuccess || onSuccess;
  return (
    <div className={resetStyles.resetContainer}>
      <ConnectionsProvider provider={provider} groupRef={groupRef}>
        <ProtectedConnectionLayout
          provider={provider}
          consumerRef={consumerRef}
          consumerName={consumerName}
          groupRef={groupRef}
          groupName={groupName}
          onSuccess={onSuccess}
          onDisconnectSuccess={onDisconnectSuccess}
        >
          <RedirectHandler redirectURL={redirectUrl}>
            <ConnectedSuccessBox
              provider={provider}
              onDisconnectSuccess={onDisconnectSuccess}
            />
          </RedirectHandler>
        </ProtectedConnectionLayout>
      </ConnectionsProvider>
    </div>
  );
}
