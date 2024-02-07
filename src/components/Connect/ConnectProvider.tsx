import { ConnectionsProvider } from '../../context/ConnectionsContextProvider';
import { ProtectedConnectionLayout } from '../Configure/layout/ProtectedConnectionLayout';
import { RedirectHandler } from '../RedirectHandler';

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
  );
}
