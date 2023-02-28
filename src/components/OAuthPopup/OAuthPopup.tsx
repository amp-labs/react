/**
 * OAuthPopup.tsx
 *
 * Takes a URL and creates a popup showing that page.
 */

import React, { useEffect, useState, useRef } from 'react';

const DEFAULT_WIDTH = 600; // px
const DEFAULT_HEIGHT = 600; // px
const DEFAULT_INTERVAL = 700; // ms

const OAUTH_SERVER = 'https://oauth-server-msdauvir5a-uc.a.run.app';
const SUCCESS_EVENT = 'AUTHORIZATION_SUCEEDED'; // [sic]

type WindowProps = {
  url: string;
  title: string;
};

type PopupProps = WindowProps & {
  onClose: (err: boolean) => void;
  children: React.ReactNode;
};

const createPopup = ({
  url, title,
}: WindowProps) => {
  const left = window.screenX + (window.outerWidth - DEFAULT_WIDTH) / 2;
  const top = window.screenY + (window.outerHeight - DEFAULT_HEIGHT) / 2.5;
  const popup = window.open(
    url,
    title,
    `width=${DEFAULT_WIDTH},height=${DEFAULT_HEIGHT},left=${left},top=${top}`,
  );
  return popup;
};

function OAuthPopup({
  title = '',
  url,
  children,
  onClose,
}: PopupProps) {
  const [externalWindow, setExternalWindow] = useState<Window | null>();
  const intervalRef = useRef<number>();

  const clearTimer = () => window.clearInterval(intervalRef.current);

  // CREATE POPUP ON COMPONENT MOUNT
  useEffect(() => {
    setExternalWindow(createPopup({ url, title }));

    window.addEventListener('message', (event) => {
      if (event.origin === OAUTH_SERVER && event.data.eventType === SUCCESS_EVENT) {
        if (externalWindow) externalWindow.close();
        clearTimer();
        if (onClose) onClose(false);
      } else {
        // TODO: HANDLE ERROR...SET `onClose(true)` to send error to parent
      }
    });
  }, []);

  // CHECK FOR OAUTH WINDOW TO CLOSE (COMPLETE)
  useEffect(() => {
    if (externalWindow) {
      intervalRef.current = window.setInterval(() => {
        // SUCCESS - INTERVAL CLEARED BY EVENT LISTENER
        if (!intervalRef) {
          onClose(false);
          return;
        }
        // FAILURE - WINDOW CLOSED BUT INTERVAL NOT CLEARED
        if (!externalWindow || externalWindow.closed) {
          onClose(true); // THROW ERROR IN PARENT
          clearTimer();
        }
      }, DEFAULT_INTERVAL);
    }
  }, [externalWindow]);

  return (
    <div>
      { children }
    </div>
  );
}

export default OAuthPopup;
