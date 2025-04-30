import { useConnections } from "src/context/ConnectionsContextProvider";
import { useProvider } from "src/hooks/useProvider";

import { FieldHeader } from "../fields/FieldHeader";

import styles from "./authenticate.module.css";

function AuthenticationRow({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  return (
    <div className={styles.authenticationRow}>
      <div className={styles.field}>{label}</div>
      <div className={styles.value}>{value}</div>
    </div>
  );
}
export function AuthenticationSection() {
  const { selectedConnection } = useConnections();
  const { providerName } = useProvider();
  const isSalesforce = selectedConnection?.provider === "salesforce";
  const workspaceString = isSalesforce ? "subdomain" : "workspace";
  const workspaceLabel = `${providerName} ${workspaceString}`;

  return (
    <>
      <FieldHeader string="Connection details" />
      <div style={{ paddingBottom: "1rem" }}>
        <AuthenticationRow
          label={workspaceLabel}
          value={selectedConnection?.providerWorkspaceRef}
        />
        <AuthenticationRow label="Status" value={selectedConnection?.status} />
      </div>
    </>
  );
}
