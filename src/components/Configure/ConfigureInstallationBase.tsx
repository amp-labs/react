import {
  Box, Button, Stack, Text,
} from '@chakra-ui/react';

import { useHydratedRevision } from '../../context/HydratedRevisionContext';

import { OptionalFields } from './fields/OptionalFields';
import { RequiredCustomFields } from './fields/RequiredCustomFields';
import { RequiredFields } from './fields/RequiredFields';

interface ConfigureInstallationBaseProps {
  onSave: () => void,
  onCancel: () => void,
  title: JSX.Element,
}

// Installation UI Base
export function ConfigureInstallationBase(
  { title, onSave, onCancel }: ConfigureInstallationBaseProps,
) {
  const { hydratedRevision, loading, error } = useHydratedRevision();

  return (
    <Box>
      <Stack direction="row" spacing={4} marginBottom="20px" flexDir="row-reverse">
        <Button backgroundColor="gray.800" _hover={{ backgroundColor: 'gray.600' }} onClick={onSave}>Save</Button>
        <Button
          backgroundColor="gray.200"
          color="blackAlpha.700"
          _hover={{ backgroundColor: 'gray.300' }}
          onClick={onCancel}
        >Cancel
        </Button>
      </Stack>
      <Box
        p={8}
        width="600px"
        minWidth="600px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        textAlign={['left']}
        margin="auto"
        bgColor="white"
        maxHeight="33rem"
        overflowY="scroll"
      >
        <Text marginBottom="20px">{title}</Text>
        {error && <div>{error}</div>}
        {loading && <div>Loading...</div>}
        {hydratedRevision && (
        <>
          <RequiredFields />
          <OptionalFields />
          <RequiredCustomFields />
        </>
        )}
      </Box>
    </Box>
  );
}
