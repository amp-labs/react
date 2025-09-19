import { useCallback, useEffect, useMemo } from "react";
import { ErrorBoundary, useErrorState } from "context/ErrorContextProvider";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import isEqual from "lodash.isequal";
import { FormControl } from "src/components/form/FormControl";

import { useSelectedConfigureState } from "../../useSelectedConfigureState";

import { setValueMapping, setValueMappingModified } from "./setValueMapping";
import { ValueHeader } from "./ValueHeader";
import { ValueMappingItem } from "./ValueMappingItem";

/**
 * ValueMappings component displays the value mappings for the selected object
 * It shows the value mappings for a field mapping that overrides the default value mappings
 *
 * implementation detail:
 * The value mapping array must be of the same length as the mappedValues array (see documentation for provider)
 * example: Salesforce Clean Status has 8 mapped values, so the value mapping array must be of length 8
 *
 * @returns
 */
export function ValueMappings() {
  const { fieldMapping } = useInstallIntegrationProps();
  const { selectedObjectName, configureState, setConfigureState } =
    useSelectedConfigureState();
  const { isError, removeError, getError } = useErrorState();

  const selectedFieldMappings = configureState?.read?.selectedFieldMappings;
  const selectedMappings = configureState?.read?.selectedValueMappings;
  const isValueMappingsModified = configureState?.read?.isValueMappingsModified;

  const valuesMappings = useMemo(() => {
    // get all the fields that have fieldMappings from the selected object
    const valuesMaps =
      selectedObjectName && fieldMapping
        ? Object.values(fieldMapping[selectedObjectName] || {})
            .flat()
            .filter((mapping) => mapping.mappedValues)
            .map((mapping) => ({ ...mapping }))
        : [];

    if (selectedFieldMappings) {
      // set the fieldName from the mapped field name if it is
      // set by the user dynamically in FieldMapping
      for (let i = 0; i < valuesMaps.length; i += 1) {
        const { mapToName } = valuesMaps[i];
        if (selectedFieldMappings?.[mapToName]) {
          valuesMaps[i].fieldName = selectedFieldMappings[mapToName];
        }
      }
    }

    return valuesMaps;
  }, [selectedObjectName, fieldMapping, selectedFieldMappings]);

  const onSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { value, name, fieldName } = e.target as typeof e.target & {
        fieldName: string;
      };

      // if place holder value is chosen, we don't change state
      if (!value) return;

      if (selectedObjectName) {
        setValueMapping(
          selectedObjectName,
          setConfigureState,
          name,
          value,
          fieldName,
        );
      }

      if (isError(ErrorBoundary.VALUE_MAPPING, name)) {
        removeError(ErrorBoundary.VALUE_MAPPING, name);
      }
    },
    [selectedObjectName, setConfigureState, isError, removeError],
  );

  // Separate useEffect to check for modifications when selectedMappings changes
  useEffect(() => {
    if (
      selectedObjectName &&
      selectedMappings &&
      configureState?.read?.savedConfig?.selectedValueMappings
    ) {
      const savedValueMappings =
        configureState?.read?.savedConfig?.selectedValueMappings;
      const updatedValueMappings = selectedMappings;
      const isModified = !isEqual(savedValueMappings, updatedValueMappings);

      setValueMappingModified(
        selectedObjectName,
        setConfigureState,
        isModified,
      );
    }
  }, [
    selectedMappings,
    selectedObjectName,
    setConfigureState,
    configureState?.read?.savedConfig?.selectedValueMappings,
  ]);

  useEffect(() => {
    if (selectedObjectName && selectedMappings) {
      // Find all fields that have mappedValues
      const fieldsWithMappings =
        fieldMapping?.[selectedObjectName]?.filter(
          (f) => f.fieldName && f.mappedValues!.length > 0,
        ) || [];

      // Check if any values are mapped for any field
      const hasAnyMappings = fieldsWithMappings.some((field) => {
        const mappingsForField = selectedMappings[field.fieldName!] || {};
        return Object.keys(mappingsForField).length > 0;
      });

      if (hasAnyMappings && fieldsWithMappings.length > 0) {
        // Set modified flag as soon as any mapping is made
        if (!isValueMappingsModified) {
          setValueMappingModified(selectedObjectName, setConfigureState, true);
        }
      }
    }
  }, [
    selectedMappings,
    valuesMappings,
    selectedObjectName,
    setConfigureState,
    fieldMapping,
    isValueMappingsModified,
  ]);

  return valuesMappings?.length ? (
    <>
      {/* value mappings for each field */}
      {valuesMappings.map((field) => {
        // show the values mapping only if the field has fieldName
        if (!field.fieldName) return null;

        // show the values mapping only for singleSelect and multiSelect type fields
        const fieldNameObject =
          configureState?.read?.allFieldsMetadata?.[field.fieldName];
        const fieldNameValueType = fieldNameObject?.valueType;
        if (!["singleSelect", "multiSelect"].includes(fieldNameValueType)) {
          const errorMsg = "fieldName is not a singleSelect or multiSelect";
          console.error(errorMsg, field);
          return null;
        }

        // show the values mapping only if the field has values array
        const fieldNameValues = fieldNameObject?.values;
        if (!fieldNameValues) return null;

        // special note: Show if the values array is of the same length as the mappedValues array
        const fieldNameValuesLength = Object.keys(fieldNameValues).length;
        const mappedValuesLength = Object.keys(
          field?.mappedValues || [],
        ).length;
        if (fieldNameValuesLength !== mappedValuesLength) {
          const errorMsg =
            "field values and the values to be mapped are not of the same length";
          console.error(errorMsg, field, fieldNameValues);
          return null;
        }

        return (
          <>
            <ValueHeader
              string="Map the values for "
              fieldName={
                field.mapToDisplayName || field.mapToName || field.fieldName
              }
            />
            <div
              style={{ display: "flex", gap: "1rem", flexDirection: "column" }}
            >
              <FormControl
                id={field.mapToName || field.fieldName}
                key={field.mapToName || field.fieldName}
              >
                {field?.mappedValues?.map((value) => {
                  const errors = getError(
                    ErrorBoundary.VALUE_MAPPING,
                    field.fieldName!,
                  );
                  const hasError =
                    Array.isArray(errors) && errors.includes(value.mappedValue);

                  // Get all available options
                  const allValueOptions =
                    configureState?.read?.allFieldsMetadata?.[field.fieldName!]
                      ?.values || [];

                  // Get currently selected values for this field (excluding current value)
                  const mappingsForField =
                    selectedMappings?.[field.fieldName!] || {};
                  const currentlySelectedValues =
                    Object.values(mappingsForField).filter(Boolean);
                  const currentValueSelection =
                    mappingsForField[value.mappedValue];

                  // Filter options to show: unselected values + current selection (if any)
                  const availableOptions = allValueOptions.filter(
                    (option: { value: string }) => {
                      const isCurrentSelection =
                        option.value === currentValueSelection;
                      const isAlreadySelected =
                        currentlySelectedValues.includes(option.value);
                      return isCurrentSelection || !isAlreadySelected;
                    },
                  );

                  return (
                    <>
                      <ValueMappingItem
                        key={`${value.mappedValue}-${field.fieldName}`}
                        allValueOptions={availableOptions}
                        mappedValue={value}
                        onSelectChange={onSelectChange}
                        fieldName={field?.fieldName || ""}
                        hasError={hasError}
                      />
                      {hasError && (
                        <span
                          key={value.mappedValue}
                          style={{
                            color: "red",
                            fontSize: "14px",
                            marginTop: "4px",
                          }}
                        >
                          {`Each ${field.mapToName || field.fieldName} must be mapped to a unique value`}
                        </span>
                      )}
                    </>
                  );
                })}
              </FormControl>
            </div>
          </>
        );
      })}
    </>
  ) : null;
}
