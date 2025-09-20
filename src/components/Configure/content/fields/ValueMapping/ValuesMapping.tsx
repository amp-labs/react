import { useCallback, useEffect, useMemo } from "react";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import isEqual from "lodash.isequal";
import { FormControl } from "src/components/form/FormControl";

import { useSelectedConfigureState } from "../../useSelectedConfigureState";

import { setValueMapping, setValueMappingModified } from "./setValueMapping";
import {
  getAvailableOptions,
  getFieldDisplayName,
  validateFieldMapping,
} from "./utils";
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
    },
    [selectedObjectName, setConfigureState],
  );

  // Track modifications when value mappings change
  useEffect(() => {
    if (!selectedObjectName || !selectedMappings) return;

    const savedValueMappings =
      configureState?.read?.savedConfig?.selectedValueMappings;

    // Compare with saved state if available
    if (savedValueMappings) {
      const isModified = !isEqual(savedValueMappings, selectedMappings);
      setValueMappingModified(
        selectedObjectName,
        setConfigureState,
        isModified,
      );
      return;
    }

    // If no saved state, check if any mappings exist
    const fieldsWithMappings =
      fieldMapping?.[selectedObjectName]?.filter(
        (f) => f.fieldName && f.mappedValues!.length > 0,
      ) || [];

    const hasAnyMappings = fieldsWithMappings.some((field) => {
      const mappingsForField = selectedMappings[field.fieldName!] || {};
      return Object.keys(mappingsForField).length > 0;
    });

    if (
      hasAnyMappings &&
      fieldsWithMappings.length > 0 &&
      !isValueMappingsModified
    ) {
      setValueMappingModified(selectedObjectName, setConfigureState, true);
    }
  }, [
    selectedMappings,
    selectedObjectName,
    setConfigureState,
    configureState?.read?.savedConfig?.selectedValueMappings,
    fieldMapping,
    isValueMappingsModified,
  ]);

  return valuesMappings?.length ? (
    <>
      {/* value mappings for each field */}
      {valuesMappings.map((field) => {
        const fieldMetadata =
          configureState?.read?.allFieldsMetadata?.[field.fieldName!];
        const validation = validateFieldMapping(field, fieldMetadata);

        if (!validation.isValid) {
          console.error(validation.errorMessage, field);
          return null;
        }

        return (
          <>
            <ValueHeader
              string="Map the values for "
              fieldName={getFieldDisplayName(field)}
            />
            <div
              style={{ display: "flex", gap: "1rem", flexDirection: "column" }}
            >
              <FormControl
                id={getFieldDisplayName(field)}
                key={getFieldDisplayName(field)}
              >
                {field?.mappedValues?.map((value) => {
                  const allValueOptions = fieldMetadata?.values || [];
                  const mappingsForField =
                    selectedMappings?.[field.fieldName!] || {};
                  const availableOptions = getAvailableOptions(
                    allValueOptions,
                    mappingsForField,
                    value.mappedValue,
                  );

                  return (
                    <ValueMappingItem
                      key={`${value.mappedValue}-${field.fieldName}`}
                      allValueOptions={availableOptions}
                      mappedValue={value}
                      onSelectChange={onSelectChange}
                      fieldName={field?.fieldName || ""}
                    />
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
