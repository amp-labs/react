import { useState } from "react";
import { UpdateConnectionSection } from "src/components/Configure/content/manage/updateConnection/UpdateConnectionSection";
import { Connection } from "src/services/api";

import { FieldHeader } from "../Configure/content/fields/FieldHeader";
import { Button } from "../ui-base/Button";

import { RemoveConnectionSection } from "./RemoveConnectionSection";

export function ManageConnectionSection({
  resetComponent,
  onDisconnectSuccess,
  provider,
}: {
  resetComponent: () => void;
  onDisconnectSuccess?: (connection: Connection) => void;
  provider?: string;
}) {
  const [showUpdateConnection, setShowUpdateConnection] = useState(false);

  return (
    <>
      {showUpdateConnection === false && (
        <>
          <FieldHeader string="Manage connection" />
          {/* Mimic style of UpdateConnectionSection */}
          <div
            style={{
              padding: "1rem 0",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <p>Click to reauthenticate or refresh your connection.</p>
            <Button
              type="button"
              // switch to update /delete connection section
              onClick={() => setShowUpdateConnection(true)}
              variant="ghost"
              style={{ fontSize: "13px" }}
            >
              Update connection
            </Button>
          </div>
        </>
      )}
      {showUpdateConnection === true && (
        <>
          <UpdateConnectionSection provider={provider} />
          <RemoveConnectionSection
            resetComponent={resetComponent}
            onDisconnectSuccess={onDisconnectSuccess}
          />
        </>
      )}
    </>
  );
}
