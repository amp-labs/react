import { useMemo } from 'react';

import { ErrorBoundary, useErrorState } from 'context/ErrorContextProvider';
import { FormControl } from 'src/components/form/FormControl';
import { useInstallIntegrationProps } from 'src/context/InstallIntegrationContextProvider';

import { useSelectedConfigureState } from '../../useSelectedConfigureState';
import { FieldHeader } from '../FieldHeader';

import { setValueMapping } from './setValueMapping';
import { ValuesFieldMapping } from './ValuesFieldMapping';

export function ValueMappings() {
  const { fieldMapping } = useInstallIntegrationProps();
  const { selectedObjectName, configureState, setConfigureState } = useSelectedConfigureState();
  const { isError, removeError } = useErrorState();

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name, fieldName } = e.target as typeof e.target & { fieldName: string };
    if (!value) {
      // if place holder value is chosen, we don't change state
      return;
    }

    if (selectedObjectName) {
      setValueMapping(selectedObjectName, setConfigureState, name, value, fieldName);
    }

    if (isError(ErrorBoundary.MAPPING, name)) {
      removeError(ErrorBoundary.MAPPING, name);
    }
  };

  const valuesMappings = useMemo(() => {
    const dynamicFieldMappings = selectedObjectName && fieldMapping
      ? Object.values(fieldMapping[selectedObjectName] || {})
        .flat()
        .filter((mapping) => mapping.fieldName)
      : [];

    return dynamicFieldMappings;
  }, [selectedObjectName, fieldMapping]);

  return valuesMappings?.length ? (
    <>
      {valuesMappings.map((field) => {
        // show the values mapping only for singleSelect and multiSelect type fields
        // show the values mapping only if the field has values array
        // And if they are of the same length as the mappedValues array
        if (field.fieldName
          && ['singleSelect', 'multiSelect'].includes(
            configureState?.read?.allFieldsMetadata?.[field.fieldName]
              ?.valueType,
          ) && configureState?.read?.allFieldsMetadata?.[field.fieldName]?.values
          && field?.mappedValues?.length === configureState?.read?.allFieldsMetadata?.[field.fieldName]?.values?.length
        ) {
          return (
            <>
              <FieldHeader string={`Map the values for ${field.fieldName}`} />
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  flexDirection: 'column',
                }}
              >
                <FormControl id={field.fieldName} key={field.fieldName}>
                  {field?.mappedValues?.map((value) => (

                    <ValuesFieldMapping
                      key={value.mappedValue}
                      allValues={configureState?.read?.allFieldsMetadata?.[field.fieldName!]?.values || []}
                      value={value}
                      onSelectChange={onSelectChange}
                      fieldName={field?.fieldName}
                    />
                  ))}
                </FormControl>
              </div>
            </>
          );
        }
        console.error('invalid configuration for mapping values found or the number of values do not match: ', field);
        return null;
      })}
    </>
  ) : null;
}
