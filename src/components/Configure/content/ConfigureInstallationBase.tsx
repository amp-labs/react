import { FormEventHandler } from 'react';
import { Button } from '@chakra-ui/react';

import { LoadingCentered } from 'components/Loading';
import { Box } from 'components/ui-base/Box/Box';
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

// fallback during migration away from chakra-ui, when variable is not defined
const borderColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--amp-colors-neutral-100').trim() || '#f5f5f5';

const boxShadow = getComputedStyle(document.documentElement)
  .getPropertyValue('--amp-shadows-sm').trim() || '0 1px 2px 0 rgba(0, 0, 0, 0.05)';

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
          <div style={{
            display: 'flex', flexDirection: 'row-reverse', gap: '1rem', marginBottom: '2rem',
          }}
          >
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
          </div>
          <Box
            style={{
              padding: '2rem',
              minHeight: '300px',
              backgroundColor: 'white',
              borderColor,
              boxShadow,
            }}
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
