import { useMemo } from 'react';
import {
  Box, FormControl,
  FormErrorMessage, Stack,
} from '@chakra-ui/react';

import { MAPPING_ERROR_BOUNDARY } from '../../../constants';
import { useConfigureState } from '../state/ConfigurationStateProvider';
import { useErrorState } from '../state/ErrorStateProvider';
import { setRequiredCustomMapFieldValue } from '../state/utils';
import { isIntegrationFieldMapping } from '../utils';

import { FieldHeader } from './FieldHeader';
import { RequiredFieldsSelect } from './RequiredFieldsSelect';

export function RequiredFieldMappings() {
  const { configureState, setConfigureState } = useConfigureState();
  const { errorState, setErrorState } = useErrorState();

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    if (!value) {
      // if place holder value is chosen, we don't change state
      return;
    }

    const { isUpdated, newState } = setRequiredCustomMapFieldValue(name, value, configureState);
    if (isUpdated) {
      setConfigureState(newState);
    }

    if (errorState[MAPPING_ERROR_BOUNDARY]?.[name]) {
      const newErrorState = { ...errorState };
      delete newErrorState[MAPPING_ERROR_BOUNDARY][name];
      setErrorState(newErrorState);
    }
  };

  const integrationFieldMappings = useMemo(
    () => configureState?.requiredMapFields?.filter(
      isIntegrationFieldMapping,
    ) || [],
    [configureState],
  );

  return (
    <Box>
      <FieldHeader string="Map the following fields (required)" />
      <Stack>
        {integrationFieldMappings.map((field) => {
          const isError = errorState[MAPPING_ERROR_BOUNDARY]
            ? !!errorState[MAPPING_ERROR_BOUNDARY][field.mapToName]
            : false;

          return (
            <FormControl key={field.mapToName} isInvalid={isError}>
              <RequiredFieldsSelect
                allFields={configureState.allFields || []}
                field={field}
                onSelectChange={onSelectChange}
              />
              <FormErrorMessage> * required</FormErrorMessage>
            </FormControl>
          );
        })}

      </Stack>
    </Box>

  );
}
