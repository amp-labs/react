import {
  STEPPER_STEP_COUNT,
  useWizard,
  WIZARD_STEP_LABELS,
  WizardStep,
} from "./WizardContext";

import styles from "./wizardStepper.module.css";

export function WizardStepper() {
  const { state } = useWizard();
  const { currentStep } = state;

  return (
    <div className={styles.stepper}>
      {Array.from({ length: STEPPER_STEP_COUNT }, (_, i) => {
        const step = i as WizardStep;
        const isComplete = step < currentStep;
        const isActive = step === currentStep;

        return (
          <div
            key={step}
            className={`${styles.step} ${isActive ? styles.active : ""} ${isComplete ? styles.complete : ""}`}
          >
            <div className={styles.stepIndicator}>
              {isComplete ? (
                <svg
                  className={styles.checkIcon}
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M13.3 4.3L6 11.6L2.7 8.3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <span className={styles.stepNumber}>{i + 1}</span>
              )}
            </div>
            <span className={styles.stepLabel}>{WIZARD_STEP_LABELS[step]}</span>
            {i < STEPPER_STEP_COUNT - 1 && <div className={styles.connector} />}
          </div>
        );
      })}
    </div>
  );
}
