import { useEffect } from "react";
import { useConnections } from "context/ConnectionsContextProvider";
import { Connection } from "services/api";

import { ProtectedConnectionLayout } from "../../layout/ProtectedConnectionLayout";
import { useWizard, WizardStep } from "../wizard/WizardContext";

import styles from "./ConnectStep.module.css";

interface ConnectStepProps {
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  resetComponent: () => void;
}

export function ConnectStep({
  consumerRef,
  consumerName,
  groupRef,
  groupName,
  resetComponent,
}: ConnectStepProps) {
  const { goToStep } = useWizard();
  const { selectedConnection } = useConnections();

  // Auto-advance to Step 2 when connection is established
  useEffect(() => {
    if (selectedConnection) {
      goToStep(WizardStep.SelectObjects);
    }
  }, [selectedConnection, goToStep]);

  const handleConnectionSuccess = (_connection: Connection) => {
    goToStep(WizardStep.SelectObjects);
  };

  return (
    <div className={styles.connectStep}>
      <ProtectedConnectionLayout
        consumerRef={consumerRef}
        consumerName={consumerName}
        groupRef={groupRef}
        groupName={groupName}
        onSuccess={handleConnectionSuccess}
        resetComponent={resetComponent}
      >
        <div className={styles.connected}>
          <p>Connected successfully. Proceeding to next step...</p>
        </div>
      </ProtectedConnectionLayout>
    </div>
  );
}
