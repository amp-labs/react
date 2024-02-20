/**
 * this page is wip: untested
 */
import {
  FormEvent, useCallback, useEffect, useState,
} from 'react';

import {
  ErrorBoundary,
} from '../../../context/ErrorContextProvider';
import { onSaveReadCreateInstallation } from '../actions/onSaveReadCreateInstallation';
import { onSaveWriteCreateInstallation } from '../actions/write/onSaveWriteCreateInstallation';
import { OTHER_CONST } from '../nav/ObjectManagementNav/constant';
import { setHydrateConfigState } from '../state/utils';
import { validateFieldMappings } from '../utils';

import { ConfigureInstallationBase } from './ConfigureInstallationBase';
import { useMutateInstallation } from './useMutateInstallation';

// the config should be undefined for create flow
const UNDEFINED_CONFIG = undefined;

//  Create Installation Flow
export function CreateInstallation() {
  const {
    integrationId, groupRef, consumerRef, setInstallation, hydratedRevision,
    loading, selectedObjectName, selectedConnection, apiKey, projectId,
    resetBoundary, setErrors,
    resetConfigureState, objectConfigurationsState, resetPendingConfigurationState, configureState,
    onInstallSuccess,
  } = useMutateInstallation();
  const [isLoading, setLoadingState] = useState<boolean>(false);

  // is other selected?
  const isOtherSelected = selectedObjectName === OTHER_CONST;

  const resetState = useCallback(
    () => {
      resetBoundary(ErrorBoundary.MAPPING);
      if (hydratedRevision?.content && !loading && selectedObjectName) {
        setHydrateConfigState(
          hydratedRevision,
          UNDEFINED_CONFIG,
          selectedObjectName,
          resetConfigureState,
        );
      }
    },
    [resetBoundary, hydratedRevision, loading, selectedObjectName, resetConfigureState],
  );

  useEffect(() => {
    // set configurationState when hydratedRevision is loaded
    if (!configureState && hydratedRevision?.content && !loading) {
      resetState();
    }
  }, [configureState, objectConfigurationsState, hydratedRevision, loading, resetState]);

  const onSaveRead = () => {
    // check if fields with requirements are met
    const { requiredMapFields, selectedFieldMappings } = configureState?.read || {};
    const { errorList } = validateFieldMappings(
      requiredMapFields,
      selectedFieldMappings,
      setErrors,
    );
    if (errorList.length > 0) { return; } // skip if there are errors

    if (selectedObjectName && selectedConnection?.id && apiKey && projectId
       && integrationId && groupRef && consumerRef && hydratedRevision) {
      setLoadingState(true);
      const res = onSaveReadCreateInstallation(
        projectId,
        integrationId,
        groupRef,
        consumerRef,
        selectedConnection.id,
        selectedObjectName,
        apiKey,
        hydratedRevision,
        configureState,
        setInstallation,
        onInstallSuccess,
      );

      res.finally(() => {
        setLoadingState(false);
        resetPendingConfigurationState(selectedObjectName);
      });
    } else {
      console.error('CreateInstallallation - onSaveReadCreate: missing required props');
    }
  };

  const onSaveWrite = () => {
    // check if fields with requirements are met
    if (selectedObjectName && selectedConnection?.id && apiKey && projectId
      && integrationId && groupRef && consumerRef && hydratedRevision) {
      setLoadingState(true);
      const res = onSaveWriteCreateInstallation(
        projectId,
        integrationId,
        groupRef,
        consumerRef,
        selectedConnection.id,
        apiKey,
        hydratedRevision,
        configureState,
        setInstallation,
        onInstallSuccess,
      );

      res.finally(() => {
        setLoadingState(false);
        resetPendingConfigurationState(selectedObjectName);// reset write pending/isModified state
      });
    } else {
      console.error('CreateInstallallation - onSaveWriteCreate: missing required props');
    }
  };

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    if (!isOtherSelected) {
      onSaveRead();
    } else {
      onSaveWrite();
    }
  };

  return (
    <ConfigureInstallationBase
      isCreateMode
      isLoading={isLoading}
      onSave={onSave}
      onReset={resetState}
    />
  );
}
