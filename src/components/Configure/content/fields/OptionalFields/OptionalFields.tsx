import { Box, Checkbox, Stack } from '@chakra-ui/react';

import { isIntegrationFieldMapping } from '../../../utils';
import { useSelectedConfigureState } from '../../useSelectedConfigureState';
import { FieldHeader } from '../FieldHeader';

import { setOptionalField } from './setOptionalField';

export function OptionalFields() {
  const {
    appName, configureState, setConfigureState, selectedObjectName,
  } = useSelectedConfigureState();
  const selectedOptionalFields = configureState?.read?.selectedOptionalFields;

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    if (selectedObjectName && configureState) {
      setOptionalField(selectedObjectName, setConfigureState, name, checked);
    }
  };

  const readOptionalFields = configureState?.read?.optionalFields;

  const onSelectAllCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;

    if (selectedObjectName && readOptionalFields) {
      readOptionalFields.forEach((field) => {
        if (!isIntegrationFieldMapping(field)) {
          setOptionalField(selectedObjectName, setConfigureState, field.fieldName, checked);
        }
      });
    }
  };

  const shouldRender = !!(readOptionalFields && readOptionalFields.length > 0);
  const isAllChecked = Object.keys(selectedOptionalFields || {}).length === readOptionalFields?.length;
  const isIndeterminate = !isAllChecked && Object.keys(selectedOptionalFields || {}).length > 0;

  return (
    shouldRender && (
      <>
        <FieldHeader string={`${appName} reads the following optional fields`} />
        <Stack
          marginBottom={10}
          maxHeight={300}
          overflowY="scroll"
          border="2px solid #EFEFEF"
          borderRadius={8}
          gap={0}
        >
          {(readOptionalFields?.length || 0) >= 2 && (
            <Box backgroundColor="gray.50" paddingX={4} paddingY={2}>
              <Checkbox
                name="selectAll"
                id="selectAll"
                onChange={onSelectAllCheckboxChange}
                isIndeterminate={isIndeterminate}
                isChecked={isAllChecked}
              >
                Select all
              </Checkbox>
            </Box>
          )}
          {readOptionalFields.map((field) => {
            if (!isIntegrationFieldMapping(field)) {
              return (
                <Box key={field.fieldName} paddingX={4} paddingY={2} borderBottom="1px" borderColor="gray.100">
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
