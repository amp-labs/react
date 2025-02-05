import { FormEventHandler } from 'react';

import { FormErrorBox } from 'components/FormErrorBox';
import { LoadingCentered } from 'components/Loading';
import { Box } from 'components/ui-base/Box/Box';
import {
  useInstallIntegrationProps,
} from 'context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider';
import { Button } from 'src/components/ui-base/Button';

import { UNINSTALL_INSTALLATION_CONST, WRITE_CONST } from '../nav/ObjectManagementNav/constant';
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
  errorMsg?: string | boolean | string[],
}

// Installation UI Base
export function ConfigureInstallationBase(
  {
    onSave, onReset, isLoading, isCreateMode = false, errorMsg,
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
  || configureState?.read?.isRequiredMapFieldsModified || configureState?.read?.isValueMappingsModified;
  const isWriteModified = configureState?.write?.isWriteModified;
  const isModified = isReadModified || isWriteModified;

  // if the read object is not completed, it is a new state
  const isSelectedReadObjectComplete = (selectedObjectName !== WRITE_CONST && !isSelectedReadConfigComplete);
  // is this a new state (modified or creating a new state)
  const isStateNew = isModified || isCreateMode || isSelectedReadObjectComplete;

  // should the save button be disabled?
  const isDisabled = loading || isLoading || !configureState || !selectedObjectName
   || !isStateNew;

  // is write selected?
  const isNonConfigurableWrite = selectedObjectName === WRITE_CONST;

  // is the form in the uninstall case?
  const isUninstall = selectedObjectName === UNINSTALL_INSTALLATION_CONST;

  const ButtonBridgeSubmit = <Button type="submit" disabled={isDisabled}>{isCreateMode ? 'Install' : 'Save'}</Button>;
  const ButtonBridgeReset = <Button type="button" onClick={onReset} disabled={isDisabled} variant="ghost">Reset</Button>;

  return (
    isLoading ? <LoadingCentered />
      : (
        <form style={{ width: '34rem' }} onSubmit={onSave}>
          <div style={{
            display: 'flex', flexDirection: 'row-reverse', gap: '.8rem', marginBottom: '20px',
          }}
          >
            {ButtonBridgeSubmit}
            {ButtonBridgeReset}
          </div>
          <Box
            style={{
              padding: '1rem 2rem',
              minHeight: '300px',
              backgroundColor: 'var(--amp-colors-bg-primary)',
              borderColor: 'var(--amp-colors-border)',
            }}
          >
            {errorMsg && (
            <FormErrorBox>
              {(typeof (errorMsg) === 'string') ? errorMsg : 'Installation Failed.'}
            </FormErrorBox>
            )}
            {loading && <LoadingCentered />}
            {hydratedRevision && !isUninstall && !isNonConfigurableWrite && <ReadFields />}
            {hydratedRevision && !isUninstall && isNonConfigurableWrite && <WriteFields />}
            {!loading && isUninstall && <UninstallContent />}
          </Box>
        </form>
      )
  );
}
