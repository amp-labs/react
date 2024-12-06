import { useState } from 'react';
import { Button as ChakraButton } from '@chakra-ui/react';

import { useApiKey } from 'context/ApiKeyContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import { api } from 'services/api';
import { Button } from 'src/components/ui-base/Button';
import { isChakraRemoved } from 'src/components/ui-base/constant';
import { useConnections } from 'src/context/ConnectionsContextProvider';
import { handleServerError } from 'src/utils/handleServerError';

interface RemoveConnectionButtonProps {
  buttonText: string;
  buttonVariant?: string;
  buttonStyle?: React.CSSProperties;
  onDisconnectSuccess?: (connectionID: string) => void;
}

export function RemoveConnectionButton({
  buttonText,
  buttonVariant = 'secondary',
  buttonStyle = {},
  onDisconnectSuccess,
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
        onDisconnectSuccess?.(selectedConnection?.id); // callback
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

  const ButtonBridge = isChakraRemoved ? (
    <Button
      type="button"
      onClick={onDelete}
      disabled={isDisabled}
      variant={buttonVariant as 'danger' | 'ghost' | undefined}
      style={buttonStyle}
    >
      {buttonContent}
    </Button>
  ) : (
    <ChakraButton
      onClick={onDelete}
      variant={buttonVariant}
      isDisabled={isDisabled}
      style={buttonStyle}
    >
      {buttonContent}
    </ChakraButton>
  );

  return ButtonBridge;
}
