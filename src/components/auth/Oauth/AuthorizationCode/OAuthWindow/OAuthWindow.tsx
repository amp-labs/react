import { useEffect, useState } from 'react';

import {
  useOpenWindowHandler,
  useReceiveMessageEventHandler,
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
  const [connectionId, setConnectionId] = useState(null);
  const [oauthWindow, setOauthWindow] = useState<Window | null>(null);

  const receiveMessage = useReceiveMessageEventHandler(setConnectionId, oauthWindow, onError);
  const openOAuthWindow = useOpenWindowHandler(windowTitle, setOauthWindow, receiveMessage, oauthUrl);

  // open the OAuth window on mount and prop change
  useEffect(() => {
    if (oauthUrl && !oauthWindow) {
      openOAuthWindow(); // creates new window and adds event listener
    }
  }, [oauthUrl, oauthWindow, openOAuthWindow, receiveMessage, windowTitle]);

  useEffect(() => {
    if (!oauthWindow) return;

    const interval = setInterval(() => {
      if (oauthWindow.closed) {
        clearInterval(interval);
        window.removeEventListener('message', receiveMessage);
        setOauthWindow(null);

        if (!connectionId && !error) {
          console.error('OAuth failed. Please try again.');
          onError?.('OAuth failed. Please try again.');
        } else if (connectionId) {
          onError?.(null);
        }
      }
    }, 500);

    // Cleanup interval and listener when component unmounts or oauthWindow changes
    // eslint-disable-next-line consistent-return
    return () => {
      clearInterval(interval);
      window.removeEventListener('message', receiveMessage);
    };
  }, [oauthWindow, connectionId, error, receiveMessage, onError]);

  return <div>{children}</div>;
}
