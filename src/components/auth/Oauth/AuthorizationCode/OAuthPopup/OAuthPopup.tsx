/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import {
  FAILURE_EVENT,
  SUCCESS_EVENT,
} from "src/components/auth/Oauth/AuthorizationCode/OAuthWindow/windowHelpers";
import { AMP_SERVER } from "src/services/api";

interface PopupListenerProps {
  url: string;
  onSuccessConnect: () => void;
  onError: (error: string) => void;
  onClose: () => void;
}

export const OAuthPopup: React.FC<PopupListenerProps> = ({
  url,
  onSuccessConnect,
  onError,
  onClose,
}) => {
  const [popup, setPopup] = useState<Window | null>(null);
  //   const [msg, setMsg] = useState<PopupMessage | null>(null);

  /** 1️⃣  Open the window on demand */
  const openPopup = useCallback(() => {
    const width = 500;
    const height = 600;
    try {
      const left = window.screenX + (window.innerWidth - width) / 2;
      const top = window.screenY + (window.innerHeight - height) / 2;

      const child = window.open(
        url, // URL you want to load
        "Auth Popup", // window name
        `popup,width=${width},height=${height},left=${left},top=${top}`,
      );

      setPopup(child);
    } catch (error) {
      console.error("error opening popup", { error });
    }
  }, [url]);

  useEffect(() => {
    if (url) {
      openPopup();
    }
  }, [url, openPopup]);

  /** 2️⃣  Listen for messages & detect closure */
  useEffect(() => {
    if (!popup) return;

    const handleMessage = (e: MessageEvent) => {
      // Guard against unexpected origins
      if (e.origin !== AMP_SERVER) return;

      if (e.data.eventType === SUCCESS_EVENT) {
        console.log("success event", { e });
        onSuccessConnect();
      } else if (e.data.eventType === FAILURE_EVENT) {
        console.log("failure event", { e });
        onError(e.data.message);
      }
    };

    window.addEventListener("message", handleMessage);

    // Poll every 500 ms to see if the user closed the popup
    const poll = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          setPopup(null); // clear ref so effect detaches listener
          clearInterval(poll);
          onClose();
        }
      } catch (error) {
        console.error("error polling popup", { error });
      }
    }, 500);

    // Cleanup when component unmounts *or* popup ref changes
    return () => {
      window.removeEventListener("message", handleMessage);
      clearInterval(poll);
    };
  }, [popup, onError, onSuccessConnect, onClose]);

  return <>Loading...</>;
};
