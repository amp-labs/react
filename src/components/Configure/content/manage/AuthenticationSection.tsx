import { useInstallIntegrationProps } from
  'src/context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider';
import { useConnectionQuery } from 'src/hooks/query';

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
  const { installation } = useInstallIntegrationProps();
  const connectionId = installation?.connection?.id || '';
  const { data: connection } = useConnectionQuery({ connectionId });

  const isSalesforce = connection?.provider === 'salesforce';
  const workspaceString = isSalesforce ? 'Subdomain' : 'Workspace';

  return (
    <>
      <FieldHeader string="Authentication" />
      <AuthenticationRow label={workspaceString} value={connection?.providerWorkspaceRef} />
      <AuthenticationRow label="Connection Status" value={connection?.status} />
    </>
  );
}
