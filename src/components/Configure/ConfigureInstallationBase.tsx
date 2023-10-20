import {
  FormEventHandler,
} from 'react';
import {
  Box, Button, Stack,
} from '@chakra-ui/react';

import { useHydratedRevision } from '../../context/HydratedRevisionContext';

import { OptionalFields } from './fields/OptionalFields';
import { RequiredCustomFields } from './fields/RequiredCustomFields';
import { RequiredFields } from './fields/RequiredFields';
import { CustomConfigureStateIntegrationField } from './types';

interface ConfigureInstallationBaseProps {
  onSave: FormEventHandler,
  onCancel: () => void,
  formErrorFields: CustomConfigureStateIntegrationField[],
  setFormErrorFields: (fields: CustomConfigureStateIntegrationField[]) => void,
}

// Installation UI Base
export function ConfigureInstallationBase(
  {
    onSave, onCancel, formErrorFields, setFormErrorFields,
  }: ConfigureInstallationBaseProps,
) {
  const { hydratedRevision, loading, error } = useHydratedRevision();

  return (
    <form
      onSubmit={onSave}
    >
      <Stack direction="row" spacing={4} marginBottom="20px" flexDir="row-reverse">
        <Button backgroundColor="gray.800" _hover={{ backgroundColor: 'gray.600' }} type="submit">Save</Button>
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
            <RequiredCustomFields
              formErrorFields={formErrorFields}
              setFormErrorFields={setFormErrorFields}
            />
            <OptionalFields />
          </>
        )}
      </Box>
    </form>
  );
}
