import { useWizard, WizardStep } from "../../wizard/WizardContext";
import { WizardNavigation } from "../../wizard/WizardNavigation";

/**
 * Placeholder for the ConfigureObjects step.
 * Will be replaced with the full implementation (per-object sub-stepper
 * with Fields, Mappings, and AdditionalFields content).
 */
export function ConfigureObjectsGate() {
  const { state, goToStep, nextStep, prevStep } = useWizard();

  if (state.selectedObjects.length === 0) {
    goToStep(WizardStep.SelectObjects);
    return null;
  }

  return (
    <div>
      <p>Configure Objects (placeholder)</p>
      <p>Selected objects: {state.selectedObjects.join(", ")}</p>
      <WizardNavigation onNext={nextStep} onBack={prevStep} />
    </div>
  );
}
