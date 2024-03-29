/**
 * OAuthPopup.tsx
 *
 * Takes a URL and creates a popup showing that page.
 */

import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';

import { useApiKey } from '../../context/ApiKeyContextProvider';
import { useConnections } from '../../context/ConnectionsContextProvider';
import { useProject } from '../../context/ProjectContextProvider';
import { AMP_SERVER, api } from '../../services/api';

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
  const { projectId } = useProject();
  const apiKey = useApiKey();
  const [externalWindow, setExternalWindow] = useState<Window | null>();
  const intervalRef = useRef<number>();

  const clearTimer = () => window.clearInterval(intervalRef.current);
  const { setSelectedConnection } = useConnections();

  useEffect(() => {
    if (url) setExternalWindow(createPopup({ url, title }));
  }, [url, title]);

  const refreshConnections = useCallback(async (connectionId: string) => {
    const connection = await api().connectionApi.getConnection({ projectId, connectionId }, {
      headers: { 'X-Api-Key': apiKey ?? '' },
    });
    setSelectedConnection(connection);
  }, [projectId, apiKey, setSelectedConnection]);

  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.origin === AMP_SERVER) {
        //  this event come from our own server
        if (event.data?.eventType === SUCCESS_EVENT) {
          clearTimer();
          const connectionId = event.data.data?.connection;
          if (!connectionId) {
            console.error(
              'Ampersand server returned a successful authorization event, but did not return a connection ID.',
            );
            onClose('There is an unexpected server issue.');
          } else {
            refreshConnections(connectionId);
            onClose(null);
          }
          if (externalWindow) externalWindow.close();
        } else if (event.data?.eventType === FAILURE_EVENT) {
          clearTimer();
          onClose(event.data.data?.message
            ?? 'There was an error logging into your Salesforce subdomain. Please try again.');
          if (externalWindow) externalWindow.close();
        }
      }
    });
  }, [externalWindow, onClose, refreshConnections]);

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
  }, [externalWindow, onClose]);

  return (
    <div>{ children }</div>
  );
}

export default OAuthPopup;
