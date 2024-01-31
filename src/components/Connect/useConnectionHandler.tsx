import { useEffect } from 'react';

import { useConnections } from '../../context/ConnectionsContext';
import { ErrorBoundary, useErrorState } from '../../context/ErrorContextProvider';
import { useProject } from '../../context/ProjectContext';

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

/**
 * only supports connection list error at this time
 * @param onError
 */
function useOnErrorHandler(onError?: (error: string) => void) {
  const { isError } = useErrorState();
  const { projectId } = useProject();
  useEffect(() => {
    const isConnectionListError = isError(ErrorBoundary.CONNECTION_LIST, projectId);
    // Check if a onError callback is present
    if (onError && isConnectionListError) {
      // call callback when error is present
      onError('ConnectionList Error');
    }
  }, [onError, projectId, isError]);
}

type ConnectionHandlerPropsProps = {
  onSuccess?: (connectionID: string) => void;
  onError?: (error: string) => void;
};

/**
 * ConnectionHandler is a component that handles onSuccess and onError callbacks
 *
 * @param redirectURL
 * @param children
 * @returns
 */
export function useConnectionHandler({ onSuccess, onError } : ConnectionHandlerPropsProps) {
  useOnSuccessHandler(onSuccess);
  useOnErrorHandler(onError);
}
