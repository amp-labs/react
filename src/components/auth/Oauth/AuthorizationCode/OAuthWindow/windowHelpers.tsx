import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AMP_SERVER } from "services/api";

const DEFAULT_WIDTH = 600; // px
const DEFAULT_HEIGHT = 600; // px

const SUCCESS_EVENT = "AUTHORIZATION_SUCCEEDED";
const FAILURE_EVENT = "AUTHORIZATION_FAILED";

/**
 * opens a new window with the OAuth URL
 *  side effect: adds a message event listener to the window
 * @param oauthUrl
 * @param windowTitle
 * @param setOauthWindow
 * @param receiveMessage
 * @returns a function to open the oauth window
 */
export function useOpenWindowHandler(
  windowTitle: string,
  setOauthWindow: React.Dispatch<React.SetStateAction<Window | null>>,
  receiveMessage: (event: MessageEvent) => void,
  oauthUrl: string | null,
) {
  return useCallback(() => {
    if (!oauthUrl) return;
    const left = window.screenX + (window.outerWidth - DEFAULT_WIDTH) / 2;
    const top = window.screenY + (window.outerHeight - DEFAULT_HEIGHT) / 2.5;
    const windowDimensions = `width=${DEFAULT_WIDTH},height=${DEFAULT_HEIGHT},left=${left},top=${top}`;

    // creates a new window
    const newWindow = window.open(oauthUrl, windowTitle, windowDimensions);
    setOauthWindow(newWindow);

    window.addEventListener("message", receiveMessage, false);
  }, [oauthUrl, windowTitle, setOauthWindow, receiveMessage]);
}

/**
 * returns a function to handle the message event
 */
export function useReceiveMessageEventHandler(
  setConnectionId: React.Dispatch<React.SetStateAction<null>>,
  oauthWindow: Window | null,
  onError?: (err: string | null) => void,
  onSuccessConnect?: () => void,
) {
  const queryClient = useQueryClient();

  return useCallback(
    (event: MessageEvent) => {
      // Ignore messages from unexpected origins
      if (event.origin !== AMP_SERVER) {
        return;
      }

      // success case
      if (event.data.eventType === SUCCESS_EVENT) {
        const connection = event.data.data?.connection; // connection id
        if (connection) {
          setConnectionId(connection);
          oauthWindow?.close(); // only close the window if connection is successful
          onSuccessConnect?.();

          // refresh connections
          queryClient.invalidateQueries({ queryKey: ["amp", "connections"] });
        } else {
          console.error("Connection ID not found in event data: ", { event });
        }
      }

      // failure case
      if (event.data.eventType === FAILURE_EVENT) {
        console.error("OAuth failed: ", { event });
        // event.data.message sent by server message
        // See `server/shared/oauth/connection.go` for the HTML that the server sends back to the UI library.
        onError?.(
          event?.data?.message ?? "Something went wrong. Please try again.",
        );
        // do not close the window if error occurs
      }
    },
    [oauthWindow, onError, queryClient, setConnectionId, onSuccessConnect],
  );
}
