import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!oauthWindow) return;

    const interval = setInterval(() => {
      if (!oauthWindow || oauthWindow.closed) {
        queryClient.invalidateQueries({ queryKey: ["amp", "connections"] });

        // Add a small delay before processing window closure
        setTimeout(() => {
          clearInterval(interval);
          window.removeEventListener("message", receiveMessage);
          setOauthWindow(null);

          if (!connectionId && !error) {
            console.error(
              "Window closed and no connection was found. Please try again.",
            );
            onError?.("Window closed prematurely. Please wait and try again.");
          } else if (connectionId) {
            onError?.(null);
          }

          // invalidate the connections query to refresh the connection list
          queryClient.invalidateQueries({ queryKey: ["amp", "connections"] });
          onWindowClose?.();
        }, 1000); // 1 second delay to allow for message reception
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
    onWindowClose,
    queryClient,
  ]);

  return <div>{children}</div>;
}
