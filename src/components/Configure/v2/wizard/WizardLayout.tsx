import { useWizard, WizardStep } from "./WizardContext";
import { WizardStepper } from "./WizardStepper";

import styles from "./WizardLayout.module.css";

interface WizardLayoutProps {
  children: React.ReactNode;
}

export function WizardLayout({ children }: WizardLayoutProps) {
  const { state } = useWizard();

  // Map step enum to array index for rendering
  const stepComponents = Array.isArray(children) ? children : [children];
  const currentStepComponent = stepComponents[state.currentStep];

  const showStepper = state.currentStep !== WizardStep.Success;

  return (
    <div className={styles.layout}>
      {showStepper && <WizardStepper />}
      <div className={styles.content}>{currentStepComponent}</div>
    </div>
  );
}

export function WizardStepContainer({
  step,
  children,
}: {
  step: WizardStep;
  children: React.ReactNode;
}) {
  const { state } = useWizard();
  if (state.currentStep !== step) return null;
  return <>{children}</>;
}
