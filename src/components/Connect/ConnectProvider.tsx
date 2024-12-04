import { ProtectedConnectionLayout } from 'components/Configure/layout/ProtectedConnectionLayout';
import { RedirectHandler } from 'components/RedirectHandler';
import { ConnectionsProvider } from 'context/ConnectionsContextProvider';
import resetStyles from 'src/styles/resetCss.module.css';

import { ConnectedSuccessBox } from './ConnectedSuccessBox';

interface ConnectProviderProps {
  provider: string,
  consumerRef: string,
  consumerName?: string,
  groupRef: string,
  groupName?: string,
  redirectUrl?: string,
  onSuccess?: (connectionID: string) => void;
}

export function ConnectProvider(
  {
    provider, consumerRef, consumerName, groupRef, groupName, redirectUrl, onSuccess,
  }: ConnectProviderProps,
) {
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
        >
          <RedirectHandler redirectURL={redirectUrl}>
            <ConnectedSuccessBox provider={provider} />
          </RedirectHandler>
        </ProtectedConnectionLayout>
      </ConnectionsProvider>
    </div>
  );
}
