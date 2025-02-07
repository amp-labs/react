import { ErrorBoundary } from 'context/ErrorContextProvider';
import { SelectMappingFields } from 'src/components/Configure/types';

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
  if (
    selectedFieldMappings
    && selectedObjectName
    && Object.values(selectedFieldMappings).some(
      (mapping) => mapping === fieldValue && mapping !== fieldName,
    )
  ) {
    console.error(
      'Each field must be mapped to a unique value',
      selectedFieldMappings,
    );

    const keysForValue = [
      fieldName,
      ...(Object.keys(selectedFieldMappings).filter(
        (key) => selectedFieldMappings[key] === fieldValue,
      ) || []),
    ];

    // set the keys for which duplicate values are found
    setError(ErrorBoundary.MAPPING, selectedObjectName, keysForValue);
    return true;
  }
  return false;
}
