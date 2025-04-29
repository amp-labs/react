import { useEffect } from "react";
import { useConnections } from "context/ConnectionsContextProvider";
import { Connection } from "src/services/api";

function useOnSuccessHandler(onSuccess?: (connection: Connection) => void) {
  const { selectedConnection } = useConnections();
  useEffect(() => {
    // Check if a onSuccess callback is present
    if (onSuccess && selectedConnection) {
      // call callback when connection is selected
      onSuccess(selectedConnection);
    }
  }, [onSuccess, selectedConnection]);
}

type ConnectionHandlerPropsProps = {
  onSuccess?: (connection: Connection) => void;
  // onError?: (error: string) => void; // not supported yet
};

/**
 * ConnectionHandler is a component that handles onSuccess and onError callbacks
 * @param onSuccess - callback function to be called when a connection is successful
 * @returns
 */
export function useConnectionHandler({
  onSuccess,
}: ConnectionHandlerPropsProps) {
  useOnSuccessHandler(onSuccess);
}
