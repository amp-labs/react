import { Box, Checkbox, Stack } from '@chakra-ui/react';

import { useSelectedConfigureState } from '../../useSelectedConfigureState';
import { FieldHeader } from '../FieldHeader';

import { setNonConfigurableWriteField } from './setNonConfigurableWriteField';

export function WriteFields() {
  const {
    appName, selectedObjectName, configureState, setConfigureState,
  } = useSelectedConfigureState();
  const selectedWriteFields = configureState?.write?.selectedNonConfigurableWriteFields;

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (selectedObjectName && configureState) {
      setNonConfigurableWriteField(selectedObjectName, setConfigureState, name, checked);
    }
  };

  const onSelectAllCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    if (selectedObjectName && configureState) {
      configureState?.write?.writeObjects?.forEach((field) => {
        setNonConfigurableWriteField(selectedObjectName, setConfigureState, field.objectName, checked);
      });
    }
  };

  const shouldRender = !!(configureState?.write?.writeObjects);
  return (
    shouldRender && (
      <>
        <FieldHeader string={`Allow ${appName} to write to these object`} />
        <Checkbox
          name="selectAll"
          id="selectAll"
          onChange={onSelectAllCheckboxChange}
          isChecked={Object.keys(selectedWriteFields || {}).length === configureState?.write?.writeObjects?.length}
          style={{ marginBottom: '10px' }}
        >
          Select All Fields
        </Checkbox>
        <Stack
          marginBottom={10}
          height={300}
          overflowY="scroll"
          border="2px solid #EFEFEF"
          borderRadius={8}
          padding={4}
        >
          {configureState?.write?.writeObjects?.map((field) => (
            <Box key={field.objectName} display="flex" gap="5px" borderBottom="1px" borderColor="gray.100">
              <Checkbox
                name={field.objectName}
                id={field.objectName}
                onChange={onCheckboxChange}
                isChecked={!!selectedWriteFields?.[field.objectName]}
              >
                {field.displayName}
              </Checkbox>
            </Box>
          ))}

        </Stack>
      </>
    )
  );
}
