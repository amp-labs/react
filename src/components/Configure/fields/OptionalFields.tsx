import { Box, Checkbox, Stack } from '@chakra-ui/react';

import { useProject } from '../../../context/ProjectContext';
import { useSelectedObjectName } from '../ObjectManagementNav';
import { useConfigureState } from '../state/ConfigurationStateProvider';
import { getConfigureState } from '../state/utils';
import { isIntegrationFieldMapping } from '../utils';

import { FieldHeader } from './FieldHeader';

export function OptionalFields() {
  const { appName } = useProject();
  const { objectConfigurationsState, setConfigureState } = useConfigureState();
  const { selectedObjectName } = useSelectedObjectName();
  const configureState = getConfigureState(selectedObjectName || '', objectConfigurationsState);

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const { optionalFields } = configureState;
    const optionalFieldToUpdate = optionalFields?.find((field) => field.fieldName === name);

    if (optionalFieldToUpdate && selectedObjectName) {
      // Update the value property to new checked value
      optionalFieldToUpdate.value = checked;

      // update state
      setConfigureState(
        selectedObjectName,
        { ...configureState, optionalFields: [...optionalFields || []] },
      );
    }
  };

  return (
    <>
      <FieldHeader string={`${appName} reads the following optional fields`} />
      <Stack
        marginBottom={10}
        height={300}
        overflowY="scroll"
        border="2px solid #EFEFEF"
        borderRadius={8}
        padding={4}
      >
        {configureState?.optionalFields?.map((field) => {
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
