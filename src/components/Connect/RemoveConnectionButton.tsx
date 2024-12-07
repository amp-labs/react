import { useState } from 'react';

import { useApiKey } from 'context/ApiKeyContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import { api, Connection } from 'services/api';
import { Button } from 'src/components/ui-base/Button';
import { useConnections } from 'src/context/ConnectionsContextProvider';
import { handleServerError } from 'src/utils/handleServerError';

interface RemoveConnectionButtonProps {
  resetComponent: () => void; // reset the Connect Provider component
  buttonText: string;
  buttonVariant?: string;
  buttonStyle?: React.CSSProperties;
  onDisconnectSuccess?: (connection: Connection) => void;
}

export function RemoveConnectionButton({
  buttonText,
  buttonVariant = 'secondary',
  buttonStyle = {},
  onDisconnectSuccess,
  resetComponent,
}: RemoveConnectionButtonProps) {
  const apiKey = useApiKey();
  const { projectId } = useProject();
  const { selectedConnection, setConnections } = useConnections();
  const [loading, setLoading] = useState<boolean>(false);
  const isDisabled = !projectId || !selectedConnection || !selectedConnection.id || loading;

  const onDelete = async () => {
    if (!isDisabled) {
      setLoading(true);
      console.warn('deleting connection', {
        projectId,
        connectionId: selectedConnection?.id,
      });
      try {
        await api().connectionApi.deleteConnection(
          { projectIdOrName: projectId, connectionId: selectedConnection?.id },
          {
            headers: {
              'X-Api-Key': apiKey,
              'Content-Type': 'application/json',
            },
          },
        );

        console.warn(
          'successfully deleted connection:',
          selectedConnection?.id,
        );
        // Trigger builder-provided callback if it exists
        onDisconnectSuccess?.(selectedConnection);
        // Reset connections
        api()
          .connectionApi.listConnections(
            {
              projectIdOrName: projectId,
            },
            {
              headers: {
                'X-Api-Key': apiKey ?? '',
              },
            },
          )
          .then((_connections) => {
            setConnections(_connections);
            resetComponent(); // reset / refresh the Connect Provider component
          })
          .catch((err) => {
            handleServerError(err);
          });
      } catch (e) {
        console.error('Error deleting connection.');
        handleServerError(e);
      } finally {
        setLoading(false);
      }
    }
  };

  const buttonContent = loading ? 'Disconnecting...' : buttonText;

  const ButtonBridge = (
    <Button
      type="button"
      onClick={onDelete}
      disabled={isDisabled}
      variant={buttonVariant as 'danger' | 'ghost' | undefined}
      style={buttonStyle}
    >
      {buttonContent}
    </Button>
  );

  return ButtonBridge;
}
