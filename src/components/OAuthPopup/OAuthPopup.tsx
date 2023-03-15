/**
 * OAuthPopup.tsx
 *
 * Takes a URL and creates a popup showing that page.
 */

import React, {
  useContext, useEffect, useState, useRef,
} from 'react';
import { AMP_BACKEND_SERVER } from '../../library/services/apiService';
import { ProviderConnectionContext } from '../AmpersandProvider';

const DEFAULT_WIDTH = 600; // px
const DEFAULT_HEIGHT = 600; // px
const DEFAULT_INTERVAL = 700; // ms

const SUCCESS_EVENT = 'AUTHORIZATION_SUCCEEDED';
const FAILURE_EVENT = 'AUTHORIZATION_FAILED';

type WindowProps = {
  url: string;
  title: string;
};

type PopupProps = WindowProps & {
  onClose: (err: string | null) => void;
  children: React.ReactNode;
};

const createPopup = ({
  url, title,
}: WindowProps) => {
  const left = window.screenX + (window.outerWidth - DEFAULT_WIDTH) / 2;
  const top = window.screenY + (window.outerHeight - DEFAULT_HEIGHT) / 2.5; // a lil shorter
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
  const {
    isConnectedToProvider,
    setIsConnectedToProvider,
  } = useContext(ProviderConnectionContext);
  const intervalRef = useRef<number>();

  const clearTimer = () => window.clearInterval(intervalRef.current);

  // CREATE POPUP ON COMPONENT MOUNT
  useEffect(() => {
    setExternalWindow(createPopup({ url, title }));

    window.addEventListener('message', (event) => {
      if (event.origin === AMP_BACKEND_SERVER) {
        if (event.data?.eventType === SUCCESS_EVENT) {
          if (externalWindow) externalWindow.close();
          clearTimer();
          setIsConnectedToProvider({ salesforce: true });
          onClose(null);
        } else if (event.data?.eventType === FAILURE_EVENT) {
          if (externalWindow) externalWindow.close();
          clearTimer();
          setIsConnectedToProvider({ salesforce: false });
          // TODO: replace with actual error from server.
          onClose('There was an error logging into your Salesforce subdomain. Please try again.');
        }
      }
    });
  }, []);

  useEffect(() => {
    if (externalWindow && !intervalRef.current) {
      intervalRef.current = window.setInterval(() => {
        // Check for OAuth success.
        if (isConnectedToProvider.salesforce) {
          onClose(null);
          return;
        }
        // Check if window was closed prematurely.
        if (!externalWindow || externalWindow.closed) {
          onClose('The popup was closed too quickly. Please try again.');
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
