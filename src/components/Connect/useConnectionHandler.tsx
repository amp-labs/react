import { useEffect } from 'react';

import { useConnections } from '../../context/ConnectionsContext';

function useOnSuccessHandler(onSuccess?: (connectionID: string) => void) {
  const { selectedConnection } = useConnections();
  useEffect(() => {
    // Check if a onSuccess callback is present
    if (onSuccess && selectedConnection) {
      // call callback when connection is selected
      onSuccess(selectedConnection.id);
    }
  }, [onSuccess, selectedConnection]);
}

type ConnectionHandlerPropsProps = {
  onSuccess?: (connectionID: string) => void;
  // onError?: (error: string) => void; // not supported yet
};

/**
 * ConnectionHandler is a component that handles onSuccess and onError callbacks
 *
 * @param redirectURL
 * @param children
 * @returns
 */
export function useConnectionHandler({ onSuccess } : ConnectionHandlerPropsProps) {
  useOnSuccessHandler(onSuccess);
}
