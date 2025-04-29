import { ErrorBoundary } from "context/ErrorContextProvider";
import { SelectMappingFields } from "src/components/Configure/types";

interface DuplicateFieldErrorProps {
  selectedFieldMappings: SelectMappingFields | null | undefined;
  selectedObjectName: string | undefined;
  fieldName: string;
  fieldValue: string;
  setError: (boundary: ErrorBoundary, key: string, value: string[]) => void;
}

export function checkDuplicateFieldError({
  selectedFieldMappings,
  selectedObjectName,
  fieldName,
  fieldValue,
  setError,
}: DuplicateFieldErrorProps): boolean {
  if (!selectedFieldMappings || !selectedObjectName) return false;

  const hasDuplicate = Object.values(selectedFieldMappings).some(
    (mapping) => mapping === fieldValue && mapping !== fieldName,
  );

  if (hasDuplicate) {
    console.error(
      "Each field must be mapped to a unique value",
      selectedFieldMappings,
    );

    const duplicateFieldValues = Object.keys(selectedFieldMappings).filter(
      (key) => selectedFieldMappings[key] === fieldValue,
    );

    // All the keys for which the duplicate value is found
    const keysForValue = [fieldName, ...duplicateFieldValues];

    // set the error boundary keys for which duplicate values are found
    setError(ErrorBoundary.MAPPING, selectedObjectName, keysForValue);
    return true;
  }
  return false;
}
