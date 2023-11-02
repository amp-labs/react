import {
  FormEventHandler,
} from 'react';
import {
  Box, Button, Stack,
} from '@chakra-ui/react';

import { LoadingIcon } from '../../assets/LoadingIcon';

import { OptionalFields } from './fields/OptionalFields';
import { RequiredFieldMappings } from './fields/RequiredFieldMappings';
import { RequiredFields } from './fields/RequiredFields';
import { useHydratedRevision } from './state/HydratedRevisionContext';

interface ConfigureInstallationBaseProps {
  onSave: FormEventHandler,
  onReset: () => void,
  isLoading: boolean,
}

// Installation UI Base
export function ConfigureInstallationBase(
  { onSave, onReset, isLoading }: ConfigureInstallationBaseProps,
) {
  const { hydratedRevision, loading } = useHydratedRevision();

  return (
    isLoading ? <LoadingIcon />
      : (
        <form style={{ width: '100%', maxWidth: '50rem' }} onSubmit={onSave}>
          <Stack direction="row" spacing={4} marginBottom="20px" flexDir="row-reverse">
            <Button
              backgroundColor="gray.800"
              _hover={{ backgroundColor: 'gray.600' }}
              type="submit"
              isDisabled={loading || isLoading}
            >Save
            </Button>
            <Button
              backgroundColor="gray.200"
              color="blackAlpha.700"
              _hover={{ backgroundColor: 'gray.300' }}
              isDisabled={loading || isLoading}
              onClick={onReset}
            >Reset
            </Button>
          </Stack>
          <Box
            p={8}
            width="100%"
            border="1px solid #EFEFEF"
            borderRadius={8}
            boxShadow="md"
            textAlign={['left']}
            margin="auto"
            bgColor="white"
            maxHeight="100%"
            overflowY="scroll"
          >
            {loading && <LoadingIcon />}
            {hydratedRevision && (
              <>
                <RequiredFields />
                <RequiredFieldMappings />
                <OptionalFields />
              </>
            )}
          </Box>
        </form>
      )
  );
}
