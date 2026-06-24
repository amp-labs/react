import type { FieldMetadata, FieldValue } from "@generated/api/src";

/**
 * Result of validating whether a value mapping can be rendered for a field.
 */
export interface ValueMappingValidation {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Validates that the resolved provider field can have its values mapped:
 * - a field must be resolved,
 * - the field must be a singleSelect / multiSelect,
 * - the field must expose a `values` array,
 * - the provider value count must match the declared mappedValues count.
 *
 * Mirrors the classic `ValueMapping/utils.ts` behavior so the wizard produces
 * the same config as the legacy flow.
 */
export function validateValueMapping(
  fieldName: string | undefined,
  mappedValuesCount: number,
  fieldMetadata?: FieldMetadata,
): ValueMappingValidation {
  if (!fieldName) {
    return { isValid: false, errorMessage: "Field name is missing" };
  }

  const valueType = fieldMetadata?.valueType;
  if (!["singleSelect", "multiSelect"].includes(valueType || "")) {
    return {
      isValid: false,
      errorMessage: "field is not a singleSelect or multiSelect",
    };
  }

  const values = fieldMetadata?.values;
  if (!values) {
    return { isValid: false, errorMessage: "Field values array is missing" };
  }

  if (values.length !== mappedValuesCount) {
    return {
      isValid: false,
      errorMessage:
        "field values and the values to be mapped are not of the same length",
    };
  }

  return { isValid: true };
}

/**
 * Gets the available provider value options for a single mapped (app) value,
 * filtering out provider values already selected for other source values so the
 * same provider value can't be picked twice within one field.
 */
export function getAvailableOptions(
  allOptions: FieldValue[],
  selectedMappings: Record<string, string>,
  currentSourceValue: string,
): FieldValue[] {
  const currentlySelectedValues =
    Object.values(selectedMappings).filter(Boolean);
  const currentValueSelection = selectedMappings[currentSourceValue];

  return allOptions.filter((option) => {
    const isCurrentSelection = option.value === currentValueSelection;
    const isAlreadySelected = currentlySelectedValues.includes(option.value);
    return isCurrentSelection || !isAlreadySelected;
  });
}
