import {
  Box, Stack,
} from '@chakra-ui/react';

import { useConfigureState } from '../state/ConfigurationStateProvider';
import { setRequiredCustomMapFieldValue } from '../state/utils';
import { isIntegrationFieldMapping } from '../utils';

import { FieldHeader } from './FieldHeader';
import { RequiredFieldsSelect } from './RequiredFieldsSelect';

export function RequiredCustomFields() {
  const { configureState, setConfigureState } = useConfigureState();
  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    setRequiredCustomMapFieldValue(name, value, configureState, setConfigureState);
  };

  const integrationFieldMappings = configureState?.requiredCustomMapFields?.filter(
    isIntegrationFieldMapping,
  ) || [];

  return (
    <Box>
      <FieldHeader string="Map the following fields (required)" />
      <Stack>
        {integrationFieldMappings.map((field) => (
          <RequiredFieldsSelect
            key={field.mapToName}
            allFields={configureState.allFields || []}
            field={field}
            onSelectChange={onSelectChange}
          />
        ))}
      </Stack>
    </Box>

  );
}
