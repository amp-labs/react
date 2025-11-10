import { useState } from "react";
import { Button } from "src/components/ui-base/Button";
import { useInstallation } from "src/headless/installation/useInstallation";

import { useSelectedConfigureState } from "../useSelectedConfigureState";
import { useSelectedObject } from "../useSelectedObject";

import { useToggleReadingObject } from "./useToggleReadingObject";

export function DisableReadObject() {
  const { installation } = useInstallation();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { selectedObjectName } = useSelectedConfigureState();
  const { displayName: selectedObjectDisplayName } = useSelectedObject();
  const { toggleReadingObject, isPending } = useToggleReadingObject();

  // Only show if read object is present and not disabled
  const readObject = selectedObjectName
    ? installation?.config?.content?.read?.objects?.[selectedObjectName]
    : undefined;

  if (!readObject) return null;

  const isDisabled = readObject.disabled;
  if (!isDisabled) return null;

  const handleDisable = () => {
    if (!selectedObjectName) return;

    toggleReadingObject({
      objectName: selectedObjectName,
      disabled: true,
      onSuccess: () => {
        setShowConfirmation(false);
      },
      onError: (error) => {
        console.error("Error stopping read from object:", error);
        // Keep confirmation dialog open on error so user can retry
      },
    });
  };

  if (showConfirmation) {
    return (
      <>
        <p
          style={{
            padding: "1rem 0",
            color: "var(--amp-colors-text-muted)",
            fontSize: "0.875rem",
          }}
        >
          Are you sure you want to stop reading from{" "}
          <b>{selectedObjectDisplayName}</b>?
        </p>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button
            type="button"
            variant="ghost"
            style={{ flex: 1 }}
            onClick={() => setShowConfirmation(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            style={{ flex: 1 }}
            onClick={handleDisable}
            disabled={isPending}
          >
            {isPending ? "Stopping..." : "Stop reading"}
          </Button>
        </div>
      </>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShowConfirmation(true)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        textDecoration: "underline",
        paddingTop: "1rem",
        margin: 0,
        fontFamily: "inherit",
        color: "var(--amp-colors-text-muted)",
      }}
    >
      Stop reading from <b>{selectedObjectDisplayName}</b>
    </button>
  );
}
