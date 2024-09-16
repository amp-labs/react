import { useEffect, useState } from 'react';
import { on } from 'events';

import { useApiKey } from 'context/ApiKeyContextProvider';
import { useConnections } from 'context/ConnectionsContextProvider';
import { useProject } from 'context/ProjectContextProvider';

import {
  useOpenWindowHandler,
  useReceiveMessageEventHandler,
  useRefreshConnectionHandler,
} from './windowHelpers';

type OAuthWindowProps = {
  children: React.ReactNode;
  windowTitle: string;
  oauthUrl: string | null;
  error?: string | null;
  onError?: (err: string | null) => void;
};

/**
 * v2 OAuth window to manage OAuth flow
 * @param param0
 * @returns
 */
export function OAuthWindow({
  children, oauthUrl, windowTitle = 'Connect to Provider', onError, error,
}: OAuthWindowProps) {
  const apiKey = useApiKey();
  const { projectId } = useProject();
  const [connectionId, setConnectionId] = useState(null);
  const [oauthWindow, setOauthWindow] = useState<Window | null>(null);
  const { setSelectedConnection } = useConnections();

  const receiveMessage = useReceiveMessageEventHandler(setConnectionId, onError);
  const openOAuthWindow = useOpenWindowHandler(windowTitle, setOauthWindow, receiveMessage, oauthUrl);
  const refreshConnections = useRefreshConnectionHandler(projectId, apiKey, setSelectedConnection);

  // open the OAuth window on mount and prop change
  useEffect(() => {
    if (oauthUrl && !oauthWindow) {
      openOAuthWindow(); // creates new window and adds event listener
    }
  }, [oauthUrl, oauthWindow, openOAuthWindow, receiveMessage, windowTitle]);

  // refresh connections on connectionId change
  useEffect(() => {
    if (connectionId) {
      refreshConnections(connectionId)
        .then(() => {
          oauthWindow?.close(); // only close the window if connection is successful
          // console.debug('Connection successful');
        }).catch((err) => {
          console.error('Error refreshing connection: ', err);
          onError?.(err.message ?? 'Unexpected error: not able to refresh connection');
        });
    }
  }, [connectionId, apiKey, setSelectedConnection, refreshConnections, oauthWindow, onError]);

  // check if the window is closed
  const interval = oauthWindow && setInterval(() => {
    if ((oauthWindow?.closed || !oauthWindow) && !!interval) {
      clearInterval(interval);

      // cleanup event listener and window reference
      window.removeEventListener('message', receiveMessage);
      setOauthWindow(null);

      if (!connectionId && !error) {
        // if connectionId is not set, then set OAuth failed error
        console.error('OAuth failed. Please try again.');
        onError?.('OAuth failed. Please try again.');
      } else if (connectionId && onError) {
        // if connectionId is set, then set OAuth success -- no error
        onError?.(null);
      }
    }
  }, 500);

  return <div>{children}</div>;
}
