import { useState } from "react";
import { Button } from "src/components/ui-base/Button";
import { useInstallIntegrationProps } from "src/context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";

import { useSelectedConfigureState } from "../useSelectedConfigureState";

import { FieldHeader } from "./FieldHeader";

export function DeleteObject() {
  const { installation } = useInstallIntegrationProps();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { selectedObjectName } = useSelectedConfigureState();

  // only show delete object if read object is present
  if (
    !selectedObjectName ||
    !installation?.config?.content?.read?.objects?.[selectedObjectName]
  )
    return null;

  const handleDelete = () => {
    // TODO: Add actual delete mutation here
    // console.log("delete mutation called");
    setShowConfirmation(false);
  };

  if (showConfirmation) {
    return (
      <>
        <FieldHeader string="Stop Syncing" />
        <p style={{ marginBottom: "1rem" }}>
          Are you sure you want to stop syncing? This action cannot be undone.
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
            onClick={handleDelete}
          >
            Confirm Stop Syncing
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <FieldHeader string="Stop Syncing" />
      <p style={{ marginBottom: "1rem" }}>
        Click to stop syncing this object and all associated data.
      </p>
      <Button
        type="button"
        variant="danger"
        style={{ width: "100%" }}
        onClick={() => setShowConfirmation(true)}
      >
        Stop Syncing
      </Button>
    </>
  );
}
