import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";

export enum WizardStep {
  Connect = 0,
  SelectObjects = 1,
  ConfigureObjects = 2,
  Review = 3,
  Success = 4,
}

/** Labels for stepper UI — Success is not shown in the stepper. */
export const WIZARD_STEP_LABELS: Record<number, string> = {
  [WizardStep.Connect]: "Connect",
  [WizardStep.SelectObjects]: "Select Objects",
  [WizardStep.ConfigureObjects]: "Configure",
  [WizardStep.Review]: "Review",
};

/** Number of steps visible in the stepper (excludes Success). */
export const STEPPER_STEP_COUNT = 4;

interface WizardState {
  currentStep: WizardStep;
  selectedObjects: string[];
  currentObjectIndex: number;
  isSubmitting: boolean;
  submissionError: string | null;
}

type WizardAction =
  | { type: "SET_STEP"; step: WizardStep }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_SELECTED_OBJECTS"; objects: string[] }
  | { type: "SET_CURRENT_OBJECT_INDEX"; index: number }
  | { type: "NEXT_OBJECT" }
  | { type: "PREV_OBJECT" }
  | { type: "SET_SUBMITTING"; isSubmitting: boolean }
  | { type: "SET_SUBMISSION_ERROR"; error: string | null };

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.step };
    case "NEXT_STEP":
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, WizardStep.Success),
      };
    case "PREV_STEP":
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, WizardStep.Connect),
      };
    case "SET_SELECTED_OBJECTS":
      return {
        ...state,
        selectedObjects: action.objects,
        currentObjectIndex: 0,
      };
    case "SET_CURRENT_OBJECT_INDEX":
      return { ...state, currentObjectIndex: action.index };
    case "NEXT_OBJECT":
      return {
        ...state,
        currentObjectIndex: Math.min(
          state.currentObjectIndex + 1,
          state.selectedObjects.length - 1,
        ),
      };
    case "PREV_OBJECT":
      return {
        ...state,
        currentObjectIndex: Math.max(state.currentObjectIndex - 1, 0),
      };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.isSubmitting };
    case "SET_SUBMISSION_ERROR":
      return { ...state, submissionError: action.error };
    default:
      return state;
  }
}

const initialState: WizardState = {
  currentStep: WizardStep.Connect,
  selectedObjects: [],
  currentObjectIndex: 0,
  isSubmitting: false,
  submissionError: null,
};

interface WizardContextValue {
  state: WizardState;
  goToStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setSelectedObjects: (objects: string[]) => void;
  nextObject: () => void;
  prevObject: () => void;
  setCurrentObjectIndex: (index: number) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setSubmissionError: (error: string | null) => void;
  isFirstObject: boolean;
  isLastObject: boolean;
  currentObjectName: string | undefined;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  const goToStep = useCallback(
    (step: WizardStep) => dispatch({ type: "SET_STEP", step }),
    [],
  );
  const nextStep = useCallback(() => dispatch({ type: "NEXT_STEP" }), []);
  const prevStep = useCallback(() => dispatch({ type: "PREV_STEP" }), []);
  const setSelectedObjects = useCallback(
    (objects: string[]) => dispatch({ type: "SET_SELECTED_OBJECTS", objects }),
    [],
  );
  const nextObject = useCallback(() => dispatch({ type: "NEXT_OBJECT" }), []);
  const prevObject = useCallback(() => dispatch({ type: "PREV_OBJECT" }), []);
  const setCurrentObjectIndex = useCallback(
    (index: number) => dispatch({ type: "SET_CURRENT_OBJECT_INDEX", index }),
    [],
  );
  const setSubmitting = useCallback(
    (isSubmitting: boolean) =>
      dispatch({ type: "SET_SUBMITTING", isSubmitting }),
    [],
  );
  const setSubmissionError = useCallback(
    (error: string | null) => dispatch({ type: "SET_SUBMISSION_ERROR", error }),
    [],
  );

  const isFirstObject = state.currentObjectIndex === 0;
  const isLastObject =
    state.currentObjectIndex === state.selectedObjects.length - 1;
  const currentObjectName = state.selectedObjects[state.currentObjectIndex];

  const value = useMemo(
    () => ({
      state,
      goToStep,
      nextStep,
      prevStep,
      setSelectedObjects,
      nextObject,
      prevObject,
      setCurrentObjectIndex,
      setSubmitting,
      setSubmissionError,
      isFirstObject,
      isLastObject,
      currentObjectName,
    }),
    [
      state,
      goToStep,
      nextStep,
      prevStep,
      setSelectedObjects,
      nextObject,
      prevObject,
      setCurrentObjectIndex,
      setSubmitting,
      setSubmissionError,
      isFirstObject,
      isLastObject,
      currentObjectName,
    ],
  );

  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
}
