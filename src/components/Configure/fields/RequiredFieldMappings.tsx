import { useMemo } from 'react';
import {
  Box, FormControl,
  FormErrorMessage, Stack,
} from '@chakra-ui/react';

import {
  ErrorBoundary, useErrorState,
} from '../../../context/ErrorContextProvider';
import { useSelectedObjectName } from '../ObjectManagementNav';
import { useConfigureState } from '../state/ConfigurationStateProvider';
import { getConfigureState, setRequiredCustomMapFieldValue } from '../state/utils';
import { isIntegrationFieldMapping } from '../utils';

import { FieldHeader } from './FieldHeader';
import { FieldMapping } from './FieldMapping';

export function RequiredFieldMappings() {
  const { selectedObjectName } = useSelectedObjectName();
  const { objectConfigurationsState, setConfigureState } = useConfigureState();
  const configureState = getConfigureState(selectedObjectName || '', objectConfigurationsState);
  const { isError, removeError } = useErrorState();

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    if (!value) {
      // if place holder value is chosen, we don't change state
      return;
    }

    const { isUpdated, newState } = setRequiredCustomMapFieldValue(name, value, configureState);
    if (isUpdated && selectedObjectName) {
      setConfigureState(selectedObjectName, newState);
    }

    if (isError(ErrorBoundary.MAPPING, name)) {
      removeError(ErrorBoundary.MAPPING, name);
    }
  };

  const integrationFieldMappings = useMemo(
    () => configureState?.requiredMapFields?.filter(
      isIntegrationFieldMapping,
    ) || [],
    [configureState],
  );

  return (
    integrationFieldMappings.length ? (
      <Box>
        <FieldHeader string="Map the following fields (required)" />
        <Stack>
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
                allFields={configureState.allFields || []}
                field={field}
                onSelectChange={onSelectChange}
              />
              <FormErrorMessage> * required</FormErrorMessage>
            </FormControl>
          ))}
        </Stack>
      </Box>
    )
      : null
  );
}
