import { Box, Checkbox, Stack } from '@chakra-ui/react';

import { useProject } from '../../../../context/ProjectContext';
import { FieldHeader } from '../FieldHeader';

// TODO - remove and fetch data from configuration state populated from hydrated revison
const WRITE_DUMMY_DATA = {
  objects: [
    {
      objectName: 'account',
      displayName: 'Account',
    },
    {
      objectName: 'contact',
      displayName: 'Contact',
    },
  ],
};

export function WriteFields() {
  const { appName } = useProject();

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    console.warn('Checking Write Fields', { name, checked });
  };

  const shouldRender = !!(WRITE_DUMMY_DATA);
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
          {WRITE_DUMMY_DATA?.objects?.map((field) => (
            <Box key={field.objectName} display="flex" gap="5px" borderBottom="1px" borderColor="gray.100">
              <Checkbox
                name={field.objectName}
                id={field.objectName}
                onChange={onCheckboxChange}
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
