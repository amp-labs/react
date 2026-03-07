import { useEffect, useRef } from "react";
import { useConnections } from "context/ConnectionsContextProvider";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { ConnectedSuccessBox } from "src/components/Connect/ConnectedSuccessBox";

import { ProtectedConnectionLayout } from "../../layout/ProtectedConnectionLayout";
import { useWizard, WizardStep } from "../wizard/WizardContext";
import { WizardNavigation } from "../wizard/WizardNavigation";

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
  const { provider } = useInstallIntegrationProps();
  const { selectedConnection } = useConnections();

  // Track whether a connection existed on mount.
  // If not, auto-advance when one is established (fresh auth flow).
  const hadConnectionOnMount = useRef(!!selectedConnection);

  useEffect(() => {
    if (!hadConnectionOnMount.current && selectedConnection) {
      goToStep(WizardStep.SelectObjects);
    }
  }, [selectedConnection, goToStep]);

  // If already connected (e.g. navigated back), show manage connection UI.
  if (hadConnectionOnMount.current && selectedConnection) {
    return (
      <div className={styles.connectStep}>
        <div className={styles.connected}>
          <ConnectedSuccessBox
            provider={provider}
            resetComponent={resetComponent}
          />
          <WizardNavigation
            showBack={false}
            onNext={() => goToStep(WizardStep.SelectObjects)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.connectStep}>
      <ProtectedConnectionLayout
        consumerRef={consumerRef}
        consumerName={consumerName}
        groupRef={groupRef}
        groupName={groupName}
        resetComponent={resetComponent}
      >
        <div className={styles.connected}>
          <ConnectedSuccessBox
            provider={provider}
            resetComponent={resetComponent}
          />
          <WizardNavigation
            showBack={false}
            onNext={() => goToStep(WizardStep.SelectObjects)}
          />
        </div>
      </ProtectedConnectionLayout>
    </div>
  );
}
