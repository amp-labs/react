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
  const {
    selectedObjectName, configureState, setConfigureState,
  } = useSelectedConfigureState();
  const { isError, removeError } = useErrorState();

  const valuesMappings = useMemo(() => (
    selectedObjectName && fieldMapping
      ? Object.values(fieldMapping[selectedObjectName] || {})
        .flat()
        .filter((mapping) => mapping.fieldName)
      : []
  ), [selectedObjectName, fieldMapping]);

  const onSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name, fieldName } = e.target as typeof e.target & { fieldName: string };
    if (!value) {
      // if place holder value is chosen, we don't change state
      return;
    }

    if (selectedObjectName) {
      setValueMapping(
        selectedObjectName,
        setConfigureState,
        name,
        value,
        fieldName,

      );
    }

    if (isError(ErrorBoundary.MAPPING, name)) {
      removeError(ErrorBoundary.MAPPING, name);
    }
  }, [selectedObjectName, setConfigureState, isError, removeError]);

  const selectedMappings = useMemo(
    () => configureState?.read?.selectedValueMappings,
    [configureState?.read?.selectedValueMappings],
  );

  const isValueMappingsModified = useMemo(
    () => configureState?.read?.isValueMappingsModified,
    [configureState?.read?.isValueMappingsModified],
  );

  const hasSetModified = useRef(false);

  useEffect(() => {
    if (selectedObjectName && selectedMappings) {
      // assuming the selectedObject only has one field with mappedValues array
      const valueMappingsForObject = fieldMapping?.[selectedObjectName].find((f) => f.fieldName)!;

      const allValuesMapped = Object.keys(selectedMappings[Object.keys(selectedMappings)[0]] || {}).length
        === Object.keys(valueMappingsForObject?.mappedValues || []).length;

      if (allValuesMapped) {
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
  }, [selectedMappings, valuesMappings, selectedObjectName, setConfigureState, fieldMapping, isValueMappingsModified]);

  return valuesMappings?.length ? (
    <>
      {valuesMappings.map((field) => {
        if (!field.fieldName) {
          console.error('fieldName is undefined', field);
          return null;
        }

        // show the values mapping only for singleSelect and multiSelect type fields
        if (!['singleSelect', 'multiSelect'].includes(
          configureState?.read?.allFieldsMetadata?.[field.fieldName]
            ?.valueType,
        )) {
          console.error('fieldName is not a singleSelect or multiSelect', field);
          return null;
        }

        // show the values mapping only if the field has values array
        // And if they are of the same length as the mappedValues array
        if (!(configureState?.read?.allFieldsMetadata?.[field.fieldName]?.values
          && Object.keys(field?.mappedValues || []).length
          === Object.keys(configureState?.read?.allFieldsMetadata?.[field.fieldName]?.values || []).length)) {
          console.error(
            'field values and the values to be mapped are not of the same length',
            field,
            configureState?.read?.allFieldsMetadata?.[field.fieldName]?.values,
          );
          return null;
        }

        return (
          <>
            <ValueHeader string="Map the values for " fieldName={field.fieldName} />
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                flexDirection: 'column',
              }}
            >
              <FormControl id={field.fieldName} key={field.fieldName}>
                {field?.mappedValues?.map((value) => (

                  <ValueMappingItem
                    key={`${value.mappedValue}-${field.fieldName}`}
                    allValueOptions={configureState?.read?.allFieldsMetadata?.[field.fieldName!]?.values || []}
                    mappedValue={value}
                    onSelectChange={onSelectChange}
                    fieldName={field?.fieldName || ''}
                  />
                ))}
              </FormControl>
            </div>
          </>
        );
      })}
    </>
  ) : null;
}
