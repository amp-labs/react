import { useState } from "react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { FormCalloutBox } from "src/components/FormCalloutBox";
import { Button } from "src/components/ui-base/Button";
import { useInstallation } from "src/headless/installation/useInstallation";

import { useSelectedConfigureState } from "../useSelectedConfigureState";
import { useSelectedObject } from "../useSelectedObject";

import { useToggleReadingObject } from "./useToggleReadingObject";

export function ReEnableReadingObject() {
  const { installation } = useInstallation();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { selectedObjectName } = useSelectedConfigureState();
  const { displayName: selectedObjectDisplayName } = useSelectedObject();
  const { toggleReadingObject, isPending } = useToggleReadingObject();

  // Only show if read object is present and disabled
  const readObject = selectedObjectName
    ? installation?.config?.content?.read?.objects?.[selectedObjectName]
    : undefined;
  if (!readObject) return null;

  const isDisabled = readObject.disabled;
  if (!isDisabled) return null;

  const handleReenable = () => {
    if (!selectedObjectName) return;

    toggleReadingObject({
      objectName: selectedObjectName,
      disabled: false,
      onSuccess: () => {
        setShowConfirmation(false);
      },
      onError: (error) => {
        console.error("Error re-enabling read object:", error);
        // Keep confirmation dialog open on error so user can retry
      },
    });
  };

  if (showConfirmation) {
    return (
      <FormCalloutBox>
        <p
          style={{
            padding: "1rem 0",
            color: "var(--amp-colors-text-muted)",
            fontSize: "0.875rem",
          }}
        >
          Are you sure you want to re-enable reading from{" "}
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
            onClick={handleReenable}
            disabled={isPending}
          >
            {isPending ? "Re-enabling..." : "Re-enable reading"}
          </Button>
        </div>
      </FormCalloutBox>
    );
  }

  return (
    <>
      <FormCalloutBox
        style={{
          backgroundColor: "var(--amp-colors-status-critical-muted)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <ExclamationTriangleIcon
            style={{
              width: "16px",
              height: "16px",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "var(--amp-colors-status-warning-dark)",
            }}
          >
            Reading is currently disabled
          </span>
        </div>
        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--amp-colors-status-warning-dark)",
            margin: "0.5rem 0 0 1.5rem",
            lineHeight: 1.5,
          }}
        >
          This object is not being synced. Click below to re-enable reading.
        </p>

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
          Re-enable reading from <b>{selectedObjectDisplayName}</b>
        </button>
      </FormCalloutBox>
    </>
  );
}
