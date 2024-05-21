import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';

import { useApiKey } from '../../../context/ApiKeyContextProvider';
import { useConnections } from '../../../context/ConnectionsContextProvider';
import { useProject } from '../../../context/ProjectContextProvider';

import { ToastOauthFailed, ToastSuccessConnection } from './oAuthWindowToast';
import { openWindow, receiveMessageEvent, refreshConnection } from './windowHelpers';

type OAuthWindowProps = {
  children: React.ReactNode;
  windowTitle: string;
  oauthUrl: string | null;
  onClose: (err: string | null) => void;
};

/**
 * v2 OAuth window to manage OAuth flow
 * @param param0
 * @returns
 */
export function OAuthWindow({
  children, oauthUrl, windowTitle = 'OAuthWindow', onClose,
}: OAuthWindowProps) {
  const toast = useToast();
  const apiKey = useApiKey();
  const { projectId } = useProject();
  const [connectionId, setConnectionId] = useState(null);
  const [oauthWindow, setOauthWindow] = useState<Window | null>(null);
  const { setSelectedConnection } = useConnections();

  const receiveMessage = receiveMessageEvent(setConnectionId);
  const openOAuthWindow = openWindow(windowTitle, setOauthWindow, receiveMessage, oauthUrl);
  const refreshConnections = refreshConnection(projectId, apiKey, setSelectedConnection);

  const cleanupEventListener = useCallback(() => {
    window.removeEventListener('message', receiveMessage);
  }, [receiveMessage]);

  // open the OAuth window on mount and prop change
  useEffect(() => {
    if (oauthUrl) {
      if (!oauthWindow) {
        openOAuthWindow(); // creates new window and adds event listener
      } else {
        console.error('OAuth window already open');
      }
    }
    // return cleanupEventListener;
  }, [cleanupEventListener, oauthUrl, oauthWindow, openOAuthWindow, receiveMessage, windowTitle]);

  // refresh connections on connectionId change
  useEffect(() => {
    if (connectionId) {
      refreshConnections(connectionId)
        .then(() => {
          ToastSuccessConnection(); // show success toast if connection is successful
          oauthWindow?.close(); // only close the window if connection is successful
        }).catch((err) => {
          console.error('Error refreshing connection: ', err);
          onClose(err.message ?? 'Unexpected error: not able to refresh connection');
        });
    }
  }, [connectionId, apiKey, setSelectedConnection, refreshConnections, oauthWindow, onClose, toast]);

  // check if the window is closed
  const interval = setInterval(() => {
    if (oauthWindow?.closed) {
      clearInterval(interval);

      // clean up event listener and window reference
      window.removeEventListener('message', receiveMessage);
      setOauthWindow(null);

      if (!connectionId) {
        ToastOauthFailed(); // if connectionId is not set, then set OAuth failed error
        if (onClose) onClose('OAuth failed. Please try again.');
      } else if (connectionId && onClose) {
        // if connectionId is set, then set OAuth success -- no error in
        onClose(null);
      }
    }
  }, 500);

  return <div>{ children }</div>;
}
