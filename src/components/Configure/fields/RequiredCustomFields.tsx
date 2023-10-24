import { useMemo } from 'react';
import {
  Box, FormControl,
  FormErrorMessage, Stack,
} from '@chakra-ui/react';

import { useConfigureState } from '../state/ConfigurationStateProvider';
import { useErrorState } from '../state/ErrorStateProvider';
import { setRequiredCustomMapFieldValue } from '../state/utils';
import { isIntegrationFieldMapping } from '../utils';

import { FieldHeader } from './FieldHeader';
import { RequiredFieldsSelect } from './RequiredFieldsSelect';

export function RequiredCustomFields() {
  const { configureState, setConfigureState } = useConfigureState();
  const { errorState, setErrorState } = useErrorState();

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    const { isUpdated, newState } = setRequiredCustomMapFieldValue(name, value, configureState);

    if (isUpdated) {
      setConfigureState(newState);
    }

    const newErrorState = { ...errorState };
    delete newErrorState[name];
    setErrorState(newErrorState);

    setRequiredCustomMapFieldValue(name, value, configureState);
  };

  const integrationFieldMappings = useMemo(
    () => configureState?.requiredCustomMapFields?.filter(
      isIntegrationFieldMapping,
    ) || [],
    [configureState],
  );

  return (
    <Box>
      <FieldHeader string="Map the following fields (required)" />
      <Stack>
        {integrationFieldMappings.map((field) => (
          <FormControl key={field.mapToName}>
            <RequiredFieldsSelect
              allFields={configureState.allFields || []}
              field={field}
              onSelectChange={onSelectChange}
            />
            <FormErrorMessage> * required</FormErrorMessage>
          </FormControl>
        ))}

      </Stack>
    </Box>

  );
}
