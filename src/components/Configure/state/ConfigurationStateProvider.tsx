import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';

import { useInstallIntegrationProps } from '../../../context/InstallIntegrationContext';
import { ConfigureState, ObjectConfigurationsState } from '../types';

import { useHydratedRevision } from './HydratedRevisionContext';
import {
  resetAllObjectsConfigurationState,
} from './utils';

// Create a context for the configuration state
const ConfigurationContext = createContext<{
  objectConfigurationsState: ObjectConfigurationsState;
  setObjectConfigurationsState: React.Dispatch<React.SetStateAction<ObjectConfigurationsState>>;
  setConfigureState:(objectName: string, configureState: ConfigureState) => void;
  resetPendingConfigurationState:(objectName: string) => void;
} | undefined>(undefined);

const initialObjectConfigurationsState: ObjectConfigurationsState = {};

// Custom hook to access and update the configuration state
export function useConfigureState() {
  const context = useContext(ConfigurationContext);
  if (!context) {
    throw new Error('useConfigureState must be used within a ConfigurationProvider');
  }
  return context;
}

type ConfigurationProviderProps = {
  children: React.ReactNode;
};

// Create a provider component for the configuration context
export function ConfigurationProvider(
  { children }: ConfigurationProviderProps,
) {
  const { installation } = useInstallIntegrationProps();
  const { hydratedRevision, loading } = useHydratedRevision();

  // 1. get config from installations (contains form selection state)
  // 2. get the hydrated revision from installation revisionId (contains full form)
  // 3. generate the configuration state from the hydrated revision and config

  const [
    objectConfigurationsState,
    setObjectConfigurationsState,
  ] = useState<ObjectConfigurationsState>(initialObjectConfigurationsState);
  const config = installation?.config;

  useEffect(() => {
    // set configurationState when hydratedRevision is loaded
    // only reset when objectConfigurationsState does not exist
    if (hydratedRevision?.content && !loading && config && !objectConfigurationsState) {
      resetAllObjectsConfigurationState(
        hydratedRevision,
        config,
        setObjectConfigurationsState,
      );
    }
  }, [hydratedRevision, loading, config, objectConfigurationsState]);

  // set configure state of single object
  const setConfigureState = useCallback((objectName: string, configureState: ConfigureState) => {
    // consider moving check modified state here
    setObjectConfigurationsState((prevState) => ({
      ...prevState,
      [objectName]: configureState,
    }));
  }, [setObjectConfigurationsState]);

  // set configure state of single object
  const resetPendingConfigurationState = useCallback((
    objectName: string,
  ) => {
    setObjectConfigurationsState((prevObjectsConfigurationsState) => ({
      ...prevObjectsConfigurationsState,
      [objectName]: {
        ...prevObjectsConfigurationsState[objectName],
        isOptionalFieldsModified: false,
        isRequiredMapFieldsModified: false,
      },
    }));
  }, [setObjectConfigurationsState]);

  const contextValue = useMemo(
    () => ({
      objectConfigurationsState,
      setObjectConfigurationsState,
      setConfigureState,
      resetPendingConfigurationState,
    }),
    [objectConfigurationsState, resetPendingConfigurationState, setConfigureState],
  );

  return (
    <ConfigurationContext.Provider value={contextValue}>
      {children}
    </ConfigurationContext.Provider>
  );
}
