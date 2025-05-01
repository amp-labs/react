import { useCallback, useEffect, useRef, useState } from "react";

import {
  useOpenWindowHandler,
  useReceiveMessageEventHandler,
} from "./windowHelpers";

type OAuthWindowProps = {
  children: React.ReactNode;
  windowTitle: string;
  oauthUrl: string | null;
  error?: string | null;
  onError?: (err: string | null) => void;
  isSuccessConnect?: boolean; // used to check if the connection is successfully created
  onSuccessConnect?: () => void; // callback to set when connection is successfully created
};

/**
 * v2 OAuth window to manage OAuth flow
 * @param param0
 * @returns
 */
export function OAuthWindow({
  children,
  oauthUrl,
  windowTitle = "Connect to Provider",
  onError,
  error,
  onSuccessConnect,
  isSuccessConnect,
}: OAuthWindowProps) {
  const [connectionId, setConnectionId] = useState(null);
  const [oauthWindow, setOauthWindow] = useState<Window | null>(null);
  const isWindowOpen = useRef(false);

  const onSetOauthWindow = useCallback((window: Window | null) => {
    setOauthWindow(window);
    isWindowOpen.current = window !== null;
  }, []);

  const onCloseOAuthWindow = useCallback(() => {
    if (oauthWindow) {
      oauthWindow.close();
    }
    setOauthWindow(null);
    isWindowOpen.current = false;
  }, [oauthWindow]);

  const receiveMessage = useReceiveMessageEventHandler(
    setConnectionId,
    onCloseOAuthWindow,
    onError,
    onSuccessConnect,
  );

  const openOAuthWindow = useOpenWindowHandler(
    windowTitle,
    onSetOauthWindow,
    receiveMessage,
    oauthUrl,
  );

  useEffect(() => {
    console.log("error", error);
  }, [error]);

  // open the OAuth window on mount and prop change
  useEffect(() => {
    // if the oauthUrl is not null, the oauthWindow is not open,
    // the connection not successfully created, and the error is not set, open the OAuth window
    if (
      oauthUrl &&
      !oauthWindow &&
      !connectionId &&
      !error &&
      !isSuccessConnect &&
      !isWindowOpen.current
    ) {
      openOAuthWindow(); // creates new window and adds event listener
    }
  }, [
    oauthUrl,
    oauthWindow,
    openOAuthWindow,
    connectionId,
    error,
    isSuccessConnect,
  ]);

  useEffect(() => {
    if (!oauthWindow) return;

    const interval = setInterval(() => {
      if (oauthWindow.closed) {
        clearInterval(interval);
        window.removeEventListener("message", receiveMessage);
        onCloseOAuthWindow();

        if (!connectionId && !error) {
          console.error("OAuth failed. Please try again.");
          onError?.("Authentication was cancelled. Please try again.");
        } else if (connectionId) {
          onError?.(null);
        }
      }
    }, 500);

    // Cleanup interval and listener when component unmounts or oauthWindow changes
    return () => {
      clearInterval(interval);
      window.removeEventListener("message", receiveMessage);
    };
  }, [
    oauthWindow,
    connectionId,
    error,
    receiveMessage,
    onError,
    onCloseOAuthWindow,
  ]);

  return <div>{children}</div>;
}
