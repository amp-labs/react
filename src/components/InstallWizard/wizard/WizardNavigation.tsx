import { Button } from "src/components/ui-base/Button";

import { useWizard, WizardStep } from "./WizardContext";

import styles from "./wizardNavigation.module.css";

interface WizardNavigationProps {
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
  showBack?: boolean;
  showNext?: boolean;
}

export function WizardNavigation({
  onNext,
  onBack,
  nextLabel,
  backLabel = "Back",
  nextDisabled = false,
  showBack = true,
  showNext = true,
}: WizardNavigationProps) {
  const { state, nextStep, prevStep } = useWizard();
  const { currentStep } = state;

  const handleBack = onBack || prevStep;
  const handleNext = onNext || nextStep;

  const isFirstStep = currentStep === WizardStep.Connect;

  return (
    <div className={styles.navigation}>
      {showBack && !isFirstStep ? (
        <Button
          type="button"
          variant="ghost"
          className={styles.backButton}
          onClick={handleBack}
        >
          {backLabel}
        </Button>
      ) : (
        <div />
      )}
      {showNext && (
        <Button
          type="button"
          className={styles.nextButton}
          onClick={handleNext}
          disabled={nextDisabled}
        >
          {nextLabel || "Next"}
        </Button>
      )}
    </div>
  );
}
