import { useCallback } from "react";
import { ConnectionsProvider } from "context/ConnectionsContextProvider";
import { InstallationProvider } from "src/headless";
import { useForceUpdate } from "src/hooks/useForceUpdate";
import { Connection } from "src/services/api";

import { ComponentContainerError } from "components/Configure/ComponentContainer";
import { AmpersandErrorBoundary } from "components/Configure/ErrorBoundary";
import { ProtectedConnectionLayout } from "components/Configure/layout/ProtectedConnectionLayout";
import { RedirectHandler } from "components/RedirectHandler";

import { ConnectedSuccessBox } from "./ConnectedSuccessBox";

import resetStyles from "src/styles/resetCss.module.css";

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
   * @param connection - Information about the newly established connection.
   */
  onConnectSuccess?: (connection: Connection) => void;
  /**
   * Callback function to be executed when a connection is successfully disconnected.
   * @param connection - Information about the disconnected connection.
   */
  onDisconnectSuccess?: (connection: Connection) => void;
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

  const onSuccessFx = useCallback(
    (connection: Connection) => {
      if (onSuccess) {
        onSuccess(connection.id);
      } else if (onConnectSuccess) {
        onConnectSuccess(connection);
      }
    },
    [onSuccess, onConnectSuccess],
  );

  return (
    <AmpersandErrorBoundary
      fallback={
        <ComponentContainerError message="Something went wrong with the connection. Please try again." />
      }
    >
      <div className={resetStyles.resetContainer} key={seed}>
        {/* InstallationProvider is nested in ConnectionsProvider and API service JWT auth */}
        <InstallationProvider
          integration={provider}
          consumerRef={consumerRef}
          consumerName={consumerName}
          groupRef={groupRef}
          groupName={groupName}
        >
          <ConnectionsProvider groupRef={groupRef} provider={provider}>
            <ProtectedConnectionLayout
              resetComponent={reset}
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
        </InstallationProvider>
      </div>
    </AmpersandErrorBoundary>
  );
}
