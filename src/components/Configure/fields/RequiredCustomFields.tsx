import {
  Box, Select, Stack, Text,
} from '@chakra-ui/react';

import { useConfigureState } from '../state/ConfigurationStateProvider';
import { isIntegrationFieldMapping } from '../utils';

import { FieldHeader } from './FieldHeader';

export function RequiredCustomFields() {
  const { configureState, setConfigureState } = useConfigureState();

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    const { requiredCustomMapFields } = configureState;
    const requiredCustomMapFieldtoUpdate = requiredCustomMapFields?.find(
      (field) => field.mapToName === name,
    );

    if (requiredCustomMapFieldtoUpdate) {
      // Update the custome field value property to new value
      requiredCustomMapFieldtoUpdate.value = value;
      const newState = {
        ...configureState,
        requiredCustomMapFields: [...requiredCustomMapFields || []],
      };

      // update state
      setConfigureState(newState);
    }
  };
  return (
    <Box>
      <FieldHeader string="Map the following fields (required)" />
      <Stack>
        {configureState.requiredCustomMapFields?.map((field) => {
          if (isIntegrationFieldMapping(field)) {
            return (
              <Stack key={field.mapToName}>
                <Text fontWeight="500">{field.mapToDisplayName}</Text>
                <Text marginBottom="5px" fontSize={14}>{field?.prompt}</Text>
                <Select
                  name={field.mapToName}
                  variant="flushed"
                  value={field.value}
                  onChange={onSelectChange}
                  placeholder="Please select one"
                >
                  {configureState?.allFields?.map((f) => (
                    <option key={f.fieldName} value={f.fieldName}>{f.displayName}</option>
                  ))}
                </Select>
              </Stack>
            );
          }
          return null; // fallback for existant fields
        })}
      </Stack>
    </Box>

  );
}
