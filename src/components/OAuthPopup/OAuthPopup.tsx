/**
 * OAuthPopup.tsx
 *
 * Takes a URL and creates a popup showing that page.
 */

import React, { useEffect, useState, useRef } from 'react';

const DEFAULT_WIDTH = 600; // px
const DEFAULT_HEIGHT = 600; // px
const DEFAULT_INTERVAL = 700; // ms

type IWindowProps = {
  url: string;
  title: string;
};

type IPopupProps = IWindowProps & {
  onClose: () => void;
  children: React.ReactNode;
};

const createPopup = ({
  url, title,
}: IWindowProps) => {
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
}: IPopupProps) {
  const [externalWindow, setExternalWindow] = useState<Window | null>();
  const intervalRef = useRef<number>();

  const clearTimer = () => window.clearInterval(intervalRef.current);

  // CREATE POPUP ON COMPONENT MOUNT
  useEffect(() => {
    setExternalWindow(createPopup({ url, title }));
  }, []);

  // CHECK FOR OAUTH WINDOW TO CLOSE (COMPLETE)
  useEffect(() => {
    if (externalWindow) {
      intervalRef.current = window.setInterval(() => {
        if (!externalWindow || externalWindow.closed) {
          onClose();
          clearTimer();
        }
      }, DEFAULT_INTERVAL);
    }
    return () => {
      if (externalWindow) externalWindow.close();
      if (onClose) onClose();
    };
  }, [externalWindow]);

  return (
    // eslint-disable-next-line
    <div>
      { children }
    </div>
  );
}

export default OAuthPopup;
