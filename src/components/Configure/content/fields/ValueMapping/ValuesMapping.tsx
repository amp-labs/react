import {
  useCallback, useEffect, useMemo, useRef,
} from 'react';

import { ErrorBoundary, useErrorState } from 'context/ErrorContextProvider';
import { FormControl } from 'src/components/form/FormControl';
import { useInstallIntegrationProps } from 'src/context/InstallIntegrationContextProvider';

import { useSelectedConfigureState } from '../../useSelectedConfigureState';

import { setValueMapping, setValueMappingModified } from './setValueMapping';
import { ValueHeader } from './ValueHeader';
import { ValueMappingItem } from './ValueMappingItem';

export function ValueMappings() {
  const { fieldMapping } = useInstallIntegrationProps();
  const { selectedObjectName, configureState, setConfigureState } = useSelectedConfigureState();
  const { isError, removeError, getError } = useErrorState();

  const selectedFieldMappings = configureState?.read?.selectedFieldMappings;
  const selectedMappings = configureState?.read?.selectedValueMappings;
  const isValueMappingsModified = configureState?.read?.isValueMappingsModified;
  const hasSetModified = useRef(false);

  const valuesMappings = useMemo(() => {
    const valuesMaps = selectedObjectName && fieldMapping
      ? Object.values(fieldMapping[selectedObjectName] || {})
        .flat()
        .filter((mapping) => mapping.mappedValues)
        .map((mapping) => ({ ...mapping }))
      : [];

    if (selectedFieldMappings) {
      // set the fieldName from the mapped field name if it is
      // set by the user dynamically in FieldMapping
      for (let i = 0; i < valuesMaps.length; i += 1) {
        if (selectedFieldMappings?.[valuesMaps[i].mapToName]) {
          valuesMaps[i].fieldName = selectedFieldMappings[valuesMaps[i].mapToName];
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
      if (!value) {
        // if place holder value is chosen, we don't change state
        return;
      }

      if (selectedObjectName) {
        setValueMapping(selectedObjectName, setConfigureState, name, value, fieldName);
      }

      if (isError(ErrorBoundary.VALUE_MAPPING, name)) {
        removeError(ErrorBoundary.VALUE_MAPPING, name);
      }
    },
    [selectedObjectName, setConfigureState, isError, removeError],
  );

  useEffect(() => {
    if (selectedObjectName && selectedMappings) {
      // Find all fields that have mappedValues
      const fieldsWithMappings = fieldMapping?.[selectedObjectName].filter(
        (f) => f.fieldName && f.mappedValues!.length > 0,
      ) || [];

      // Check if all values are mapped for all fields
      const allFieldsFullyMapped = fieldsWithMappings.every((field) => {
        const mappingsForField = selectedMappings[field.fieldName!] || {};
        return Object.keys(mappingsForField).length === Object.keys(field.mappedValues!).length;
      });

      if (allFieldsFullyMapped && fieldsWithMappings.length > 0) {
        // Only set modified flag if we haven't set it before and it's currently false
        if (!isValueMappingsModified && !hasSetModified.current) {
          setValueMappingModified(selectedObjectName, setConfigureState, true);
          hasSetModified.current = true;
        }
      } else {
        // Reset the ref if not all values are mapped
        hasSetModified.current = false;
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
      {valuesMappings.map((field) => {
        if (!field.fieldName) {
          const errorMsg = 'fieldName is undefined';
          console.error(errorMsg, field);
          return null;
        }

        const allFieldsMetadata = configureState?.read?.allFieldsMetadata;
        const metadataForField = allFieldsMetadata?.[field.fieldName];

        // show the values mapping only for singleSelect and multiSelect type fields
        if (!['singleSelect', 'multiSelect'].includes(metadataForField?.valueType)) {
          const errorMsg = 'fieldName is not a singleSelect or multiSelect';
          console.error(errorMsg, field);
          return null;
        }

        if (!metadataForField?.values) {
          console.error('field has no values array', field);
          return null;
        }
        // show the values mapping only if the field has values array
        // And if they are of the same length as the mappedValues array
        if (!(metadataForField?.values
          && Object.keys(field?.mappedValues || []).length === Object.keys(metadataForField?.values || []).length)
        ) {
          const errorMsg = 'field values and the values to be mapped are not of the same length';
          console.error(errorMsg, field, metadataForField?.values);
          return null;
        }

        return (
          <>
            <ValueHeader
              string="Map the values for "
              fieldName={field.mapToName || field.fieldName}
            />
            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
              <FormControl
                id={field.mapToName || field.fieldName}
                key={field.mapToName || field.fieldName}
              >
                {field?.mappedValues?.map((value) => {
                  const errors = getError(ErrorBoundary.VALUE_MAPPING, field.fieldName!);
                  const hasError = Array.isArray(errors) && errors.includes(value.mappedValue);
                  return (
                    <>
                      <ValueMappingItem
                        key={`${value.mappedValue}-${field.fieldName}`}
                        allValueOptions={allFieldsMetadata?.[field.fieldName!]?.values || []}
                        mappedValue={value}
                        onSelectChange={onSelectChange}
                        fieldName={field?.fieldName || ''}
                        hasError={hasError}
                      />
                      {hasError && (
                        <span
                          key={value.mappedValue}
                          style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}
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
