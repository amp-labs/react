import { ProtectedConnectionLayout } from 'components/Configure/layout/ProtectedConnectionLayout';
import { RedirectHandler } from 'components/RedirectHandler';
import { ConnectionsProvider } from 'context/ConnectionsContextProvider';
import { useForceUpdate } from 'src/hooks/useForceUpdate';
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
  const { seed, reset } = useForceUpdate(); // resets the component when the seed changes

  const onSuccessFx = onConnectSuccess || onSuccess;
  return (
    <div className={resetStyles.resetContainer} key={seed}>
      <ConnectionsProvider provider={provider} groupRef={groupRef}>
        <ProtectedConnectionLayout
          provider={provider}
          consumerRef={consumerRef}
          consumerName={consumerName}
          groupRef={groupRef}
          groupName={groupName}
          onSuccess={onSuccessFx}
          onDisconnectSuccess={onDisconnectSuccess}
        >
          <RedirectHandler redirectURL={redirectUrl}>
            <ConnectedSuccessBox
              resetComponent={reset}
              provider={provider}
              onDisconnectSuccess={onDisconnectSuccess}
            />
          </RedirectHandler>
        </ProtectedConnectionLayout>
      </ConnectionsProvider>
    </div>
  );
}
