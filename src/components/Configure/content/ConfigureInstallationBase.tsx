import { FormEventHandler } from 'react';
import { Button as ChakraButton } from '@chakra-ui/react';

import { FormErrorBox } from 'components/FormErrorBox';
import { LoadingCentered } from 'components/Loading';
import { Box } from 'components/ui-base/Box/Box';
import { useInstallIntegrationProps } from 'context/InstallIntegrationContextProvider';
// import { FormCalloutBox } from 'src/components/FormCalloutBox';
import { Button } from 'src/components/ui-base/Button';
import { isChakraRemoved } from 'src/components/ui-base/constant';

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
  errorMsg?: string | boolean,
}

// fallback during migration away from chakra-ui, when variable is not defined
const borderColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--amp-colors-border').trim() || '#e5e5e5';

const backgroundColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--amp-colors-background').trim() || 'white';

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

  const ButtonBridgeSubmit = isChakraRemoved
    ? <Button type="submit" disabled={isDisabled}>{isCreateMode ? 'Install' : 'Save'}</Button>
    : (
      <ChakraButton type="submit" variant="primary" isDisabled={isDisabled}>
        {isCreateMode ? 'Install' : 'Save'}
      </ChakraButton>
    );

  const ButtonBridgeReset = isChakraRemoved
    ? <Button type="button" onClick={onReset} disabled={isDisabled} variant="ghost">Reset</Button>
    : (
      <ChakraButton isDisabled={isDisabled} onClick={onReset}>Reset</ChakraButton>
    );

  return (
    isLoading ? <LoadingCentered />
      : (
        <form style={{ width: '34rem' }} onSubmit={onSave}>
          <div style={{
            display: 'flex', flexDirection: 'row-reverse', gap: '.8rem', marginBottom: '2rem',
          }}
          >
            {ButtonBridgeSubmit}
            {ButtonBridgeReset}
          </div>
          <Box
            style={{
              padding: '1rem 2rem',
              minHeight: '300px',
              backgroundColor,
              borderColor,
            }}
          >
            {/* data comes from hydrated revision */}
            {/* <FormCalloutBox>People in Clarify is mapped to Contacts in Hubspot</FormCalloutBox> */}
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
