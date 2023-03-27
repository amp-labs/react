/**
 * OAuthPopup.tsx
 *
 * Takes a URL and creates a popup showing that page.
 */

import React, {
  useContext, useEffect, useState, useRef,
} from 'react';
import { AMP_BACKEND_SERVER } from '../../services/apiService';
import { ProviderConnectionContext } from '../AmpersandProvider';

const DEFAULT_WIDTH = 600; // px
const DEFAULT_HEIGHT = 600; // px
const DEFAULT_INTERVAL = 500; // ms

const SUCCESS_EVENT = 'AUTHORIZATION_SUCCEEDED';
const FAILURE_EVENT = 'AUTHORIZATION_FAILED';

type WindowProps = {
  url: string;
  title: string;
};

type PopupProps = {
  url: string | null;
  title: string;
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
    setIsConnectedToProvider,
  } = useContext(ProviderConnectionContext);
  const intervalRef = useRef<number>();

  const clearTimer = () => window.clearInterval(intervalRef.current);

  useEffect(() => {
    if (url) setExternalWindow(createPopup({ url, title }));
  }, [url]);

  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.origin === AMP_BACKEND_SERVER) {
        if (event.data?.eventType === SUCCESS_EVENT) {
          clearTimer();
          setIsConnectedToProvider({ salesforce: true });
          onClose(null);
          if (externalWindow) externalWindow.close();
        } else if (event.data?.eventType === FAILURE_EVENT) {
          clearTimer();
          setIsConnectedToProvider({ salesforce: false });
          onClose(event.data?.errorMessage ?? 'There was an error logging into your Salesforce subdomain. Please try again.');
          if (externalWindow) externalWindow.close();
        }
      }
    });
  }, []);

  useEffect(() => {
    if (externalWindow && !intervalRef.current) {
      intervalRef.current = window.setInterval(() => {
        // Check if window was closed prematurely.
        if (!externalWindow || externalWindow.closed) {
          clearTimer();
          onClose('The popup was closed too quickly. Please try again.');
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
