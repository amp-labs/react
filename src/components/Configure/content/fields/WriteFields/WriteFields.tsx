import { Box, Checkbox, Stack } from '@chakra-ui/react';

import { FieldHeader } from '../FieldHeader';
import { useFields } from '../useFields';

import { setNonConfigurableWriteField } from './setNonConfigurableWriteField';

export function WriteFields() {
  const {
    appName, selectedObjectName, configureState, setConfigureState,
  } = useFields();
  const selectedWriteFields = configureState?.write?.selectedNonConfigurableWriteFields;

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (selectedObjectName && configureState) {
      setNonConfigurableWriteField(selectedObjectName, setConfigureState, name, checked);
    }
  };

  const shouldRender = !!(configureState?.write?.writeObjects);
  return (
    shouldRender && (
      <>
        <FieldHeader string={`Allow ${appName} to write to these object`} />
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
