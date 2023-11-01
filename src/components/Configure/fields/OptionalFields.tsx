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
  const { selectedOptionalFields } = configureState || {};

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    if (selectedObjectName) {
      // Update the value property to new checked value
      const updatedSelectedOptionalFields = {
        ...selectedOptionalFields,
        [name]: checked,
      };

      // update state
      setConfigureState(
        selectedObjectName,
        {
          ...configureState,
          selectedOptionalFields: updatedSelectedOptionalFields,
        },
      );
    }
  };

  const shouldRender = !!(configureState?.optionalFields && configureState?.optionalFields)
  return (
    shouldRender && (
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
                    isChecked={!!selectedOptionalFields?.[field?.fieldName]}
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
    )
  );
}
