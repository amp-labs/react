import {
  FormEventHandler,
} from 'react';
import {
  Box, Button, Stack,
} from '@chakra-ui/react';

import { useHydratedRevision } from '../../context/HydratedRevisionContext';

import { OptionalFields } from './fields/OptionalFields';
import { RequiredFieldMappings } from './fields/RequiredFieldMappings';
import { RequiredFields } from './fields/RequiredFields';

interface ConfigureInstallationBaseProps {
  onSave: FormEventHandler,
  onReset: () => void,
}

// Installation UI Base
export function ConfigureInstallationBase(
  { onSave, onReset }: ConfigureInstallationBaseProps,
) {
  const { hydratedRevision, loading, error } = useHydratedRevision();
  console.log("hydratedRevision", hydratedRevision)

  return (
    <form onSubmit={onSave}>
      <Stack direction="row" spacing={4} marginBottom="20px" flexDir="row-reverse">
        <Button backgroundColor="gray.800" _hover={{ backgroundColor: 'gray.600' }} type="submit">Save</Button>
        <Button
          backgroundColor="gray.200"
          color="blackAlpha.700"
          _hover={{ backgroundColor: 'gray.300' }}
          onClick={onReset}
        >Reset
        </Button>
      </Stack>
      <Box
        p={8}
        maxWidth="900px"
        minWidth="500px"
        border="1px solid #EFEFEF"
        borderRadius={8}
        boxShadow="md"
        textAlign={['left']}
        margin="auto"
        bgColor="white"
        maxHeight="100%"
        overflowY="scroll"
      >
        {error && <div>{error}</div>}
        {loading && <div>Loading...</div>}
        {hydratedRevision && (
          <>
            <RequiredFields />
            <RequiredFieldMappings />
            <OptionalFields />
          </>
        )}
      </Box>
    </form>
  );
}
