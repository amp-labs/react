import isEqual from "lodash.isequal";

interface Field {
  fieldName?: string;
  mapToName?: string;
  mapToDisplayName?: string;
  mappedValues?: Array<{ mappedValue: string; mappedDisplayValue: string }>;
}

interface FieldMetadata {
  valueType: string;
  values?: Record<string, any>;
}

/**
 * Gets the display name for a field, preferring mapToDisplayName over mapToName over fieldName
 */
export function getFieldDisplayName(field: Field): string {
  return field.mapToDisplayName || field.mapToName || field.fieldName || "";
}

/**
 * Validates if a field mapping is valid for display
 */
export function validateFieldMapping(
  field: Field,
  fieldMetadata?: FieldMetadata,
): { isValid: boolean; errorMessage?: string } {
  // Field must have a fieldName
  if (!field.fieldName) {
    return { isValid: false, errorMessage: "Field name is missing" };
  }

  // Field must be singleSelect or multiSelect
  const fieldValueType = fieldMetadata?.valueType;
  if (!["singleSelect", "multiSelect"].includes(fieldValueType || "")) {
    return {
      isValid: false,
      errorMessage: "fieldName is not a singleSelect or multiSelect",
    };
  }

  // Field must have values array
  const fieldValues = fieldMetadata?.values;
  if (!fieldValues) {
    return { isValid: false, errorMessage: "Field values array is missing" };
  }

  // Values array must match mappedValues array length
  const fieldValuesLength = Object.keys(fieldValues).length;
  const mappedValuesLength = Object.keys(field?.mappedValues || []).length;
  if (fieldValuesLength !== mappedValuesLength) {
    return {
      isValid: false,
      errorMessage:
        "field values and the values to be mapped are not of the same length",
    };
  }

  return { isValid: true };
}

/**
 * Compares two value mapping objects, treating undefined and empty objects as equal
 */
export function isValueMappingsEqual(
  mappings1: Record<string, Record<string, string>> | undefined | null,
  mappings2: Record<string, Record<string, string>> | undefined | null,
): boolean {
  // Helper function to check if a mapping object is effectively empty
  const isEmpty = (
    obj: Record<string, Record<string, string>> | undefined | null,
  ): boolean => {
    if (!obj) return true;

    const keys = Object.keys(obj);
    if (keys.length === 0) return true;

    // Check if all field mappings are empty
    return keys.every((key) => {
      const fieldMapping = obj[key];
      return !fieldMapping || Object.keys(fieldMapping).length === 0;
    });
  };

  const isEmpty1 = isEmpty(mappings1);
  const isEmpty2 = isEmpty(mappings2);

  // If both are empty, they're equal
  if (isEmpty1 && isEmpty2) {
    return true;
  }

  // If only one is empty, they're not equal
  if (isEmpty1 !== isEmpty2) {
    return false;
  }

  // Both are non-empty, use deep equality check
  return isEqual(mappings1, mappings2);
}

/**
 * Gets available options for a field, filtering out already selected values
 */
export function getAvailableOptions(
  allOptions: Array<{ value: string; displayValue: string }>,
  selectedMappings: Record<string, string>,
  currentValue: string,
): Array<{ value: string; displayValue: string }> {
  const currentlySelectedValues =
    Object.values(selectedMappings).filter(Boolean);
  const currentValueSelection = selectedMappings[currentValue];

  return allOptions.filter((option) => {
    const isCurrentSelection = option.value === currentValueSelection;
    const isAlreadySelected = currentlySelectedValues.includes(option.value);
    return isCurrentSelection || !isAlreadySelected;
  });
}
