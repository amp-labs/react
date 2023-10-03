/**
 * OAuthPopup.tsx
 *
 * Takes a URL and creates a popup showing that page.
 */

import React, {
  useContext, useEffect, useRef, useState,
} from 'react';

import { ApiKeyContext } from '../../context/ApiKeyContext';
import { useConnectionsList } from '../../context/ConnectionsListContext';
import { useProjectId } from '../../context/ProjectContext';
import { AMP_SERVER, api, Connection } from '../../services/api';

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
  const intervalRef = useRef<number>();

  const clearTimer = () => window.clearInterval(intervalRef.current);
  const { setConnections } = useConnectionsList();
  const projectId = useProjectId();
  const apiKey = useContext(ApiKeyContext);

  useEffect(() => {
    if (url) setExternalWindow(createPopup({ url, title }));
  }, [url, title]);

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
            refreshConnectionsList(projectId, connectionId, setConnections, apiKey);
            onClose(null);
          }
          if (externalWindow) externalWindow.close();
        } else if (event.data?.eventType === FAILURE_EVENT) {
          clearTimer();
          onClose(event.data.data?.message ?? 'There was an error logging into your Salesforce subdomain. Please try again.');
          if (externalWindow) externalWindow.close();
        }
      }
    });
  }, [externalWindow, onClose, apiKey, projectId]);

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

async function refreshConnectionsList(projectId: string, connectionId: string, setConnections: (connections: Connection[] | null) => void, apiKey: string | null) {
  const connection = await api.getConnection({ projectId, connectionId }, {
    headers: {
      'X-Api-Key': apiKey ?? '',
    },
  });
  setConnections([connection]);
}

export default OAuthPopup;
