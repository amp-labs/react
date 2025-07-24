import { Connection } from "services/api";
import { Button } from "src/components/ui-base/Button";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider";
import { useConnections } from "src/context/ConnectionsContextProvider";
import { useDeleteConnectionMutation } from "src/hooks/mutation/useDeleteConnectionMutation";
import { handleServerError } from "src/utils/handleServerError";

interface RemoveConnectionButtonProps {
  resetComponent: () => void; // reset the Connect Provider component
  buttonText: string;
  buttonVariant?: string;
  buttonStyle?: React.CSSProperties;
  onDisconnectSuccess?: (connection: Connection) => void;
  onDisconnectError?: (errorMsg: string) => void;
}

export function RemoveConnectionButton({
  buttonText,
  buttonVariant = "secondary",
  buttonStyle = {},
  onDisconnectSuccess,
  resetComponent,
  onDisconnectError,
}: RemoveConnectionButtonProps) {
  const { projectIdOrName } = useAmpersandProviderProps();
  const { selectedConnection } = useConnections();
  const { mutate: deleteConnection, isPending: isDeletePending } =
    useDeleteConnectionMutation();

  const isDisabled =
    !projectIdOrName ||
    !selectedConnection ||
    !selectedConnection.id ||
    isDeletePending;

  const onDelete = async () => {
    if (!isDisabled) {
      console.warn("deleting connection", {
        projectIdOrName,
        connectionId: selectedConnection?.id,
      });

      deleteConnection(
        {
          projectIdOrName,
          connectionId: selectedConnection?.id,
        },
        {
          onSuccess: () => {
            console.warn(
              "successfully deleted connection:",
              selectedConnection?.id,
            );
            // Trigger builder-provided callback if it exists
            onDisconnectSuccess?.(selectedConnection);
            resetComponent(); // reset / refresh the Connect Provider component
          },
          onError: (error) => {
            handleServerError(error, onDisconnectError);
          },
        },
      );
    }
  };

  const buttonContent = isDeletePending ? "Pending..." : buttonText;

  const ButtonBridge = (
    <Button
      type="button"
      onClick={onDelete}
      disabled={isDisabled}
      variant={buttonVariant as "danger" | "ghost" | undefined}
      style={buttonStyle}
    >
      {buttonContent}
    </Button>
  );

  return ButtonBridge;
}
