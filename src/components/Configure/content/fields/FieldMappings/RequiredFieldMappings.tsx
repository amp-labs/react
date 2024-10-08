import { useMemo } from 'react';
import { FormControl, FormErrorMessage } from '@chakra-ui/react';

import { ErrorBoundary, useErrorState } from 'context/ErrorContextProvider';

import { isIntegrationFieldMapping } from '../../../utils';
import { useSelectedConfigureState } from '../../useSelectedConfigureState';
import { FieldHeader } from '../FieldHeader';

import { FieldMapping } from './FieldMapping';
import { setFieldMapping } from './setFieldMapping';

export function RequiredFieldMappings() {
  const { selectedObjectName, configureState, setConfigureState } = useSelectedConfigureState();
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

  const integrationFieldMappings = useMemo(
    () => configureState?.read?.requiredMapFields?.filter(
      isIntegrationFieldMapping,
    ) || [],
    [configureState],
  );

  return (
    integrationFieldMappings.length ? (
      <>
        <FieldHeader string="Map the following fields (required)" />
        <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
          {integrationFieldMappings.map((field: any) => (
            <FormControl
              key={field.mapToName}
              isInvalid={
              isError(
                ErrorBoundary.MAPPING,
                field.mapToName,
              )
            }
            >
              <FieldMapping
                allFields={configureState.read?.allFields || []}
                field={field}
                onSelectChange={onSelectChange}
              />
              <FormErrorMessage> * required</FormErrorMessage>
            </FormControl>
          ))}
        </div>
      </>
    )
      : null
  );
}
