import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useProject } from 'context/ProjectContextProvider';
import { Connection, useAPI } from 'services/api';
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

const useDeleteConnectionMutation = () => {
  const getAPI = useAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['deleteConnection'],
    mutationFn: async ({ projectIdOrName, connectionId }: any) => {
      const api = await getAPI();
      return api.connectionApi.deleteConnection({ projectIdOrName, connectionId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amp', 'connections'] });
    },
    onError: (error) => {
      console.error('Error deleting connection.');
      handleServerError(error);
    },
  });
};

export function RemoveConnectionButton({
  buttonText,
  buttonVariant = 'secondary',
  buttonStyle = {},
  onDisconnectSuccess,
  resetComponent,
}: RemoveConnectionButtonProps) {
  const { projectId } = useProject();
  const { selectedConnection } = useConnections();
  const deleteConnectionMutation = useDeleteConnectionMutation();
  const [loading, setLoading] = useState<boolean>(false);
  const isDisabled = !projectId || !selectedConnection || !selectedConnection.id || loading;

  const onDelete = async () => {
    if (!isDisabled) {
      setLoading(true);
      console.warn('deleting connection', {
        projectId,
        connectionId: selectedConnection?.id,
      });

      deleteConnectionMutation.mutate(
        {
          projectIdOrName: projectId,
          connectionId: selectedConnection?.id,
        },
        {
          onSuccess: () => {
            console.warn('successfully deleted connection:', selectedConnection?.id);
            // Trigger builder-provided callback if it exists
            onDisconnectSuccess?.(selectedConnection);
            resetComponent(); // reset / refresh the Connect Provider component
          },
          onSettled: () => setLoading(false),
        },
      );
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
