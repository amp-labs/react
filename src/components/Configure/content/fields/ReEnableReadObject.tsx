import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { FormCalloutBox } from "src/components/FormCalloutBox";
import { FormSuccessBox } from "src/components/FormSuccessBox";
import { Button } from "src/components/ui-base/Button";
import { useInstallation } from "src/headless/installation/useInstallation";

import { useSelectedConfigureState } from "../useSelectedConfigureState";
import { useSelectedObject } from "../useSelectedObject";

import { useToggleReadingObject } from "./useToggleReadingObject";

export function ReEnableReadObject() {
  const { installation } = useInstallation();
  const { selectedObjectName } = useSelectedConfigureState();
  const { displayName: selectedObjectDisplayName } = useSelectedObject();
  const { toggleReadingObject, isPending } = useToggleReadingObject();

  // Only show if read object is present and disabled
  const readObject = selectedObjectName
    ? installation?.config?.content?.read?.objects?.[selectedObjectName]
    : undefined;
  if (!readObject) return null;

  // If reading is already enabled, show a success box
  const isDisabled = readObject.disabled;
  if (!isDisabled)
    return (
      <FormSuccessBox>
        <p>Reading from {selectedObjectDisplayName} is enabled.</p>
      </FormSuccessBox>
    );

  const handleReenable = () => {
    if (!selectedObjectName) return;

    toggleReadingObject({
      objectName: selectedObjectName,
      disabled: false,
      onError: (error) => {
        console.error("Error re-enabling read object:", error);
        // Keep confirmation dialog open on error so user can retry
      },
    });
  };

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
          <span style={{ fontWeight: 600 }}>Reading is currently disabled</span>
        </div>
        <p style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>
          This object is not being synced. Click below to re-enable reading from{" "}
          <b>{selectedObjectDisplayName}</b>.
        </p>

        <Button
          type="button"
          onClick={handleReenable}
          variant="ghost"
          style={{
            marginTop: "1rem",
            width: "100%",
          }}
          disabled={isPending}
        >
          {isPending
            ? "Re-enabling..."
            : "Re-enable reading from <b>{selectedObjectDisplayName}</b>"}
        </Button>
      </FormCalloutBox>
    </>
  );
}
