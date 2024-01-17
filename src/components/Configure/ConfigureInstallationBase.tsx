import {
  FormEventHandler,
} from 'react';
import {
  Box, Button, Stack,
} from '@chakra-ui/react';

import { LoadingIcon } from '../../assets/LoadingIcon';

import { RequiredFieldMappings } from './fields/FieldMappings';
import { OptionalFields } from './fields/OptionalFields';
import { RequiredFields } from './fields/RequiredFields';
import { WriteFields } from './fields/WriteFields';
import { OTHER_CONST } from './ObjectManagementNav/OtherTab';
import { UNINSTALL_INSTALLATION_CONST } from './ObjectManagementNav/UninstallInstallation';
import { useConfigureState } from './state/ConfigurationStateProvider';
import { useHydratedRevision } from './state/HydratedRevisionContext';
import { getConfigureState } from './state/utils';
import { useSelectedObjectName } from './ObjectManagementNav';
import { UninstallContent } from './UninstallContent';

interface ConfigureInstallationBaseProps {
  isCreateMode?: boolean,
  onSave: FormEventHandler,
  onReset: () => void,
  isLoading: boolean,
}

// Installation UI Base
export function ConfigureInstallationBase(
  {
    onSave, onReset, isLoading, isCreateMode = false,
  }: ConfigureInstallationBaseProps,
) {
  const { hydratedRevision, loading } = useHydratedRevision();
  const { selectedObjectName } = useSelectedObjectName();
  const { objectConfigurationsState } = useConfigureState();
  const configureState = getConfigureState(selectedObjectName || '', objectConfigurationsState);

  // has the form been modified?
  const isModified = configureState?.read?.isOptionalFieldsModified
    || configureState?.read?.isRequiredMapFieldsModified;

  // is this a new state (modified or creating a new state)
  const isStateNew = isModified || isCreateMode;

  // should the save button be disabled?
  const isDisabled = loading || isLoading || !configureState || !selectedObjectName
   || !isStateNew;

  // is other selected?
  const isNonConfigurableWrite = selectedObjectName === OTHER_CONST;

  // is the form in the uninstall case?
  const isUninstall = selectedObjectName === UNINSTALL_INSTALLATION_CONST;

  return (
    isLoading ? <LoadingIcon />
      : (
        <form style={{ width: '100%', maxWidth: '50rem' }} onSubmit={onSave}>
          <Stack direction="row" spacing={4} marginBottom="20px" flexDir="row-reverse">
            <Button
              backgroundColor="gray.800"
              _hover={{ backgroundColor: 'gray.600' }}
              type="submit"
              isDisabled={isDisabled}
            >
              { isCreateMode ? 'Install' : 'Save'}
            </Button>
            <Button
              backgroundColor="gray.200"
              color="blackAlpha.700"
              _hover={{ backgroundColor: 'gray.300' }}
              isDisabled={isDisabled}
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
            {hydratedRevision && !isUninstall && !isNonConfigurableWrite && (
              <>
                <RequiredFields />
                <RequiredFieldMappings />
                <OptionalFields />
              </>
            )}
            {hydratedRevision && !isUninstall && isNonConfigurableWrite && <WriteFields />}
            {!loading && isUninstall && <UninstallContent />}
          </Box>
        </form>
      )
  );
}
