import { useMemo } from 'react';
import { FormControl as ChakraFormControl, FormErrorMessage as ChakraFormErrorMessage } from '@chakra-ui/react';
import { IntegrationFieldMapping } from '@generated/api/src';

import { ErrorBoundary, useErrorState } from 'context/ErrorContextProvider';
import { FormControl } from 'src/components/form/FormControl';
import { isChakraRemoved } from 'src/components/ui-base/constant';
import { useInstallIntegrationProps } from 'src/context/InstallIntegrationContextProvider';

import { isIntegrationFieldMapping } from '../../../utils';
import { useSelectedConfigureState } from '../../useSelectedConfigureState';
import { FieldHeader } from '../FieldHeader';

import { FieldMapping } from './FieldMapping';
import { setFieldMapping } from './setFieldMapping';

export function RequiredFieldMappings() {
  const { selectedObjectName, configureState, setConfigureState } = useSelectedConfigureState();
  const { fieldMapping } = useInstallIntegrationProps();
  const { isError, removeError } = useErrorState();

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    if (!value) {
      // if place holder value is chosen, we don't change state
      return;
    }

    if (selectedObjectName) {
      setFieldMapping(selectedObjectName, setConfigureState, name, value);
    }

    if (isError(ErrorBoundary.MAPPING, name)) {
      removeError(ErrorBoundary.MAPPING, name);
    }
  };

  const integrationFieldMappings = useMemo(() => {
    if (!selectedObjectName || !fieldMapping) return [];
    // Extract dynamic field mappings for the selected object name from the fieldMapping object
    const dynamicFieldMappings = fieldMapping
      ? Object.values(fieldMapping[selectedObjectName] || {}).flat()
      : [];
    // Combine dynamic field mappings with the required map fields from configureState
    const combinedFieldMappings = (configureState?.read?.requiredMapFields || [])
      .concat(dynamicFieldMappings)
      // Remove duplicates based on mapToName and keep the latest item
      .reduce((acc, item) => {
        const existingItem = acc.find((i) => i.mapToName === item.mapToName);
        if (existingItem) return acc.map((i) => (i.mapToName === item.mapToName ? item : i));
        return acc.concat(item);
      }, new Array<IntegrationFieldMapping>());
    // Filter out any items that are not instances of IntegrationFieldMapping
    return combinedFieldMappings.filter(isIntegrationFieldMapping);
  }, [configureState, fieldMapping, selectedObjectName]);

  return integrationFieldMappings.length ? (
    <>
      <FieldHeader string="Map the following fields (required)" />
      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        {integrationFieldMappings.map((field) => {
          if (isChakraRemoved) {
            return (
              <FormControl
                id={field.mapToName}
                key={field.mapToName}
                isInvalid={isError(ErrorBoundary.MAPPING, field.mapToName)}
                errorMessage="* required"
              >
                <FieldMapping
                  allFields={configureState?.read?.allFields || []}
                  field={field}
                  onSelectChange={onSelectChange}
                />
              </FormControl>
            );
          }

          // Chakra UI FormControl
          return (
            <ChakraFormControl
              key={field.mapToName}
              isInvalid={isError(ErrorBoundary.MAPPING, field.mapToName)}
            >
              <FieldMapping
                allFields={configureState?.read?.allFields || []}
                field={field}
                onSelectChange={onSelectChange}
              />
              <ChakraFormErrorMessage> * required</ChakraFormErrorMessage>
            </ChakraFormControl>
          );
        })}
      </div>
    </>
  ) : null;
}
