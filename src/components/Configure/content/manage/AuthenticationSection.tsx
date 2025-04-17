import { useConnections } from 'src/context/ConnectionsContextProvider';

import { FieldHeader } from '../fields/FieldHeader';

import styles from './authenticate.module.css';

function AuthenticationRow({ label, value }: { label: string; value: string | undefined; }) {
  return (
    <div className={styles.authenticationRow}>
      <div className={styles.field}>{label}</div>
      <div className={styles.value}>{value}</div>
    </div>
  );
}
export function AuthenticationSection() {
  const { selectedConnection } = useConnections();
  const isSalesforce = selectedConnection?.provider === 'salesforce';
  const workspaceString = isSalesforce ? 'Subdomain' : 'Workspace';

  return (
    <>
      <FieldHeader string="Authentication" />
      <div style={{ paddingBottom: '1rem' }}>
        <AuthenticationRow label={workspaceString} value={selectedConnection?.providerWorkspaceRef} />
        <AuthenticationRow label="Connection Status" value={selectedConnection?.status} />
      </div>
    </>
  );
}
