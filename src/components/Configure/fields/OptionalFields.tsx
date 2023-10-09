import {
  Box, Checkbox, Stack, Text,
} from '@chakra-ui/react';

import { useConfigureState } from '../state/ConfigurationStateProvider';
import { isIntegrationFieldMapping } from '../utils';

export function OptionalFields() {
  const { configureState, setConfigureState } = useConfigureState();
  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const { optionalFields } = configureState;
    const optionalFieldToUpdate = optionalFields?.find((field) => field.fieldName === name);

    if (optionalFieldToUpdate) {
      // Update the value property to new checked value
      optionalFieldToUpdate.value = checked;

      // update state
      setConfigureState({ ...configureState, optionalFields: [...optionalFields || []] });
    }
  };

  return (
    <>
      <Text marginBottom="5px">Optional Fields</Text>
      <Stack marginBottom="20px">
        {configureState.optionalFields?.map((field) => {
          if (!isIntegrationFieldMapping(field)) {
            return (
              <Box key={field.fieldName} display="flex" gap="5px" borderBottom="1px" borderColor="gray.100">
                <Checkbox
                  name={field.fieldName}
                  id={field.fieldName}
                  isChecked={!!field.value}
                  onChange={onCheckboxChange}
                >
                  {field.displayName}
                </Checkbox>
              </Box>
            );
          }
          return null; // fallback for customed mapped fields
        })}
      </Stack>
    </>
  );
}
