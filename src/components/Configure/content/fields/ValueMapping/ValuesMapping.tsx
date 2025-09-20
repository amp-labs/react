import { useCallback, useEffect, useMemo } from "react";
import { ErrorBoundary, useErrorState } from "context/ErrorContextProvider";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { FormControl } from "src/components/form/FormControl";

import { useValueMappingStore } from "../../../../../stores/valueMappingStore";
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
 * i.e. sample input to InstallIntegration
 * const mapping: FieldMapping = {
  "contact": [
    {
      mapToName: "custom_enum",
      prompt: "Map the values for custom_enum",
      // 8 mapped values map to 8 values in contact: Clean Status
      mappedValues: [
        {
          mappedValue: "red",
          mappedDisplayValue: "red"
        },
        {
          mappedValue: "orange",
          mappedDisplayValue: "orange"
        },
        {
          mappedValue: "blue",
          mappedDisplayValue: "blue"
        },
        {
          mappedValue: "green",
          mappedDisplayValue: "green"
        },
        {
          mappedValue: "yellow",
          mappedDisplayValue: "yellow"
        },
        {
          mappedValue: "purple",
          mappedDisplayValue: "purple"
        },
        {
          mappedValue: "brown",
          mappedDisplayValue: "brown"
        },
        {
          mappedValue: "gray",
          mappedDisplayValue: "gray"
        },
      ]
    }
  ]
};
 * 
 * @returns
 */
export function ValueMappings() {
  const { fieldMapping } = useInstallIntegrationProps();
  const { selectedObjectName, configureState, setConfigureState } =
    useSelectedConfigureState();
  const { isError, removeError, getError } = useErrorState();

  // Zustand store hooks
  const {
    updateMapping,
    loadFromExternal,
    saveSnapshot,
    getMappingForField,
    isDirty,
  } = useValueMappingStore();

  const selectedFieldMappings = configureState?.read?.selectedFieldMappings;
  const selectedMappings = configureState?.read?.selectedValueMappings;

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

      // Update Zustand store
      updateMapping(fieldName, name, value);

      // Still update the old state for backward compatibility
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
    [
      selectedObjectName,
      setConfigureState,
      isError,
      removeError,
      updateMapping,
    ],
  );

  // Sync external state with Zustand store
  useEffect(() => {
    if (selectedMappings) {
      loadFromExternal(selectedMappings);
    }
  }, [selectedMappings, loadFromExternal]);

  // Initialize saved state when component mounts or saved config changes
  useEffect(() => {
    if (configureState?.read?.savedConfig?.selectedValueMappings) {
      const savedValueMappings =
        configureState.read.savedConfig.selectedValueMappings;
      loadFromExternal(savedValueMappings);
      saveSnapshot(); // Set this as the saved state for dirty comparison
    }
  }, [
    configureState?.read?.savedConfig?.selectedValueMappings,
    loadFromExternal,
    saveSnapshot,
  ]);

  // Update the modified flag based on Zustand dirty state
  useEffect(() => {
    if (selectedObjectName) {
      const zustandIsDirty = isDirty();
      setValueMappingModified(
        selectedObjectName,
        setConfigureState,
        zustandIsDirty,
      );
    }
  }, [selectedObjectName, setConfigureState, isDirty]);

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
                  const mappingsForField = getMappingForField(field.fieldName!);
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
