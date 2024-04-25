import { Box, Checkbox, Stack } from '@chakra-ui/react';

import { useSelectedConfigureState } from '../../useSelectedConfigureState';
import { FieldHeader } from '../FieldHeader';

import { setNonConfigurableWriteField } from './setNonConfigurableWriteField';

export function WriteFields() {
  const {
    appName, selectedObjectName, configureState, setConfigureState,
  } = useSelectedConfigureState();
  const selectedWriteFields = configureState?.write?.selectedNonConfigurableWriteFields;
  const writeObjects = configureState?.write?.writeObjects;

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

  const shouldRender = !!(writeObjects);
  return (
    shouldRender && (
      <>
        <FieldHeader string={`Allow ${appName} to write to these object`} />
        <Stack
          marginBottom={10}
          maxHeight={300}
          overflowY="scroll"
          border="2px solid #EFEFEF"
          borderRadius={8}
          gap={0}
        >
          {(writeObjects?.length || 0) >= 2 && (
          <Box backgroundColor="gray.100" paddingX={4} paddingTop={2}>
            <Checkbox
              name="selectAll"
              id="selectAll"
              onChange={onSelectAllCheckboxChange}
              isChecked={Object.keys(selectedWriteFields || {}).length === configureState?.write?.writeObjects?.length}
              style={{ marginBottom: '10px' }}
            >
              Select all
            </Checkbox>
          </Box>
          )}
          {writeObjects.map((field) => (
            <Box
              key={field.objectName}
              display="flex"
              alignItems="center"
              borderBottom="1px"
              borderColor="gray.100"
              paddingX={4}
              paddingY={2}
            >
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
