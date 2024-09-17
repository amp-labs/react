import {
  FormEventHandler,
} from 'react';
import {
  Box, Button, Stack,
} from '@chakra-ui/react';

import { LoadingCentered } from 'components/Loading';
import { useInstallIntegrationProps } from 'context/InstallIntegrationContextProvider';

import { OTHER_CONST } from '../nav/ObjectManagementNav/constant';
import { UNINSTALL_INSTALLATION_CONST } from '../nav/ObjectManagementNav/UninstallInstallation';
import { useHydratedRevision } from '../state/HydratedRevisionContext';
import { getReadObject } from '../utils';

import { ReadFields } from './fields/ReadFields';
import { WriteFields } from './fields/WriteFields';
import { UninstallContent } from './UninstallContent';
import { useSelectedConfigureState } from './useSelectedConfigureState';

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
  const { installation } = useInstallIntegrationProps();
  const { hydratedRevision, loading } = useHydratedRevision();
  const { configureState, selectedObjectName } = useSelectedConfigureState();

  // check if selected object is completed.
  const config = installation?.config;
  const isSelectedReadConfigComplete = (config && selectedObjectName
    && !!getReadObject(config, selectedObjectName)) || false;

  // has the form been modified?
  const isReadModified = configureState?.read?.isOptionalFieldsModified
  || configureState?.read?.isRequiredMapFieldsModified;
  const isWriteModified = configureState?.write?.isWriteModified;
  const isModified = isReadModified || isWriteModified;

  // if the read object is not completed, it is a new state
  const isSelectedReadObjectComplete = (selectedObjectName !== OTHER_CONST && !isSelectedReadConfigComplete);
  // is this a new state (modified or creating a new state)
  const isStateNew = isModified || isCreateMode || isSelectedReadObjectComplete;

  // should the save button be disabled?
  const isDisabled = loading || isLoading || !configureState || !selectedObjectName
   || !isStateNew;

  // is other selected?
  const isNonConfigurableWrite = selectedObjectName === OTHER_CONST;

  // is the form in the uninstall case?
  const isUninstall = selectedObjectName === UNINSTALL_INSTALLATION_CONST;

  return (
    isLoading ? <LoadingCentered />
      : (
        <form style={{ width: '100%', maxWidth: '50rem' }} onSubmit={onSave}>
          <Stack direction="row" spacing={4} marginBottom="20px" flexDir="row-reverse">
            <Button
              variant="primary"
              type="submit"
              isDisabled={isDisabled}
            >
              {isCreateMode ? 'Install' : 'Save'}
            </Button>
            <Button
              isDisabled={isDisabled}
              onClick={onReset}
            >Reset
            </Button>
          </Stack>
          <Box
            p={8}
            borderRadius={4}
            boxShadow="sm"
            margin="auto"
            backgroundColor="white"
            border="1px solid gray.100"
            minHeight={300}
          >
            {loading && <LoadingCentered />}
            {hydratedRevision && !isUninstall && !isNonConfigurableWrite && <ReadFields />}
            {hydratedRevision && !isUninstall && isNonConfigurableWrite && <WriteFields />}
            {!loading && isUninstall && <UninstallContent />}
          </Box>
        </form>
      )
  );
}
