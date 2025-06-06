import { Connection } from "src/services/api";

import { FieldHeader } from "../Configure/content/fields/FieldHeader";

import { RemoveConnectionButton } from "./RemoveConnectionButton";

interface RemoveConnectionSectionProps {
  resetComponent: () => void;
  onDisconnectSuccess?: (connection: Connection) => void;
}

export function RemoveConnectionSection({
  resetComponent,
  onDisconnectSuccess,
}: RemoveConnectionSectionProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <FieldHeader string="Remove connection" />
      <p>Click to disconnect your connection from the provider.</p>
      <RemoveConnectionButton
        resetComponent={resetComponent}
        onDisconnectSuccess={onDisconnectSuccess}
        buttonText="Remove connection"
        buttonVariant="danger"
        buttonStyle={{ fontSize: "13px", width: "100%" }}
      />
    </div>
  );
}
