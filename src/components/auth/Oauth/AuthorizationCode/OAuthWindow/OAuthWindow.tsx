import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

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
  onWindowClose?: () => void; // callback to set when window is closed
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
  onWindowClose,
}: OAuthWindowProps) {
  const [connectionId, setConnectionId] = useState(null);
  const [oauthWindow, setOauthWindow] = useState<Window | null>(null);
  const queryClient = useQueryClient();
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // ① keeps the ID across render

  const receiveMessage = useReceiveMessageEventHandler(
    setConnectionId,
    oauthWindow,
    onError,
    onSuccessConnect,
  );
  const openOAuthWindow = useOpenWindowHandler(
    windowTitle,
    setOauthWindow,
    receiveMessage,
    oauthUrl,
  );

  // open the OAuth window on mount and prop change
  useEffect(() => {
    // if the oauthUrl is not null, the oauthWindow is not open,
    // the connection not successfully created, and the error is not set, open the OAuth window
    if (
      oauthUrl &&
      !oauthWindow &&
      !connectionId &&
      !error &&
      !isSuccessConnect
    ) {
      onError?.(null); // clear the error
      openOAuthWindow(); // creates new window and adds event listener
    }
  }, [
    oauthUrl,
    oauthWindow,
    openOAuthWindow,
    connectionId,
    error,
    isSuccessConnect,
    onError,
  ]);

  const handleWindowClose = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["amp", "connections"] });
    setOauthWindow(null);

    if (!connectionId && !error) {
      console.error(
        "Window closed and no connection was found. Please try again.",
      );
      onError?.("Window closed prematurely. Please wait and try again.");
    } else if (connectionId) {
      onError?.(null);
    }

    onWindowClose?.();

    // Add a small delay before removing the event listener
    setTimeout(() => {
      window.removeEventListener("message", receiveMessage);
    }, 1000);
  }, [
    connectionId,
    error,
    onError,
    onWindowClose,
    receiveMessage,
    queryClient,
  ]);

  useEffect(() => {
    if (!oauthWindow) return;

    intervalRef.current = setInterval(() => {
      if (!oauthWindow || oauthWindow.closed) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        handleWindowClose();
      }
    }, 500);

    // Cleanup interval and listener when component unmounts or oauthWindow changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      window.removeEventListener("message", receiveMessage);
    };
  }, [handleWindowClose, oauthWindow, receiveMessage]);

  return <div>{children}</div>;
}
