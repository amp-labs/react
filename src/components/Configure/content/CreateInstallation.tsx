/**
 * this page is wip: untested
 */
import {
  useCallback, useEffect, useState,
} from 'react';

import {
  ErrorBoundary,
} from '../../../context/ErrorContextProvider';
import { onSaveCreate } from '../actions/onSaveCreate';
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
  } = useMutateInstallation();
  const [isLoading, setLoadingState] = useState<boolean>(false);

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

  const onSave = (e: any) => {
    e.preventDefault();
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
      const res = onSaveCreate(
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
      );

      res.finally(() => {
        setLoadingState(false);
        resetPendingConfigurationState(selectedObjectName);
      });
    } else {
      console.error('OnSaveCreate: missing required props');
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
