import { useState } from "react";
import { Button } from "src/components/ui-base/Button";
import { useInstallIntegrationProps } from "src/context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { capitalize } from "src/utils";

import { useHydratedRevision } from "../../state/HydratedRevisionContext";
import { useSelectedConfigureState } from "../useSelectedConfigureState";

/**
 * Hook to get the selected object and its display name
 * @returns {object} - The selected object and its display name
 */
const useSelectedObject = () => {
  const { hydratedRevision } = useHydratedRevision();
  const { selectedObjectName } = useSelectedConfigureState();

  const selectedReadObject = hydratedRevision?.content?.read?.objects?.find(
    (obj) => obj.objectName === selectedObjectName,
  );

  const displayName =
    selectedReadObject?.displayName ||
    (selectedObjectName && capitalize(selectedObjectName));

  return {
    selectedObject: selectedReadObject,
    displayName,
  };
};

/**
 * DeleteObject component
 * @returns {React.ReactNode} - The DeleteObject component
 */
export function DeleteObject() {
  const { installation } = useInstallIntegrationProps();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { selectedObjectName } = useSelectedConfigureState();
  const { displayName: selectedObjectDisplayName } = useSelectedObject();

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
            onClick={handleDelete}
          >
            Stop reading
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
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
    </>
  );
}
