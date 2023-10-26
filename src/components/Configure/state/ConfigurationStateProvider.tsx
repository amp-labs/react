import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';

import { useHydratedRevision } from '../../../context/HydratedRevisionContext';
import { useInstallIntegrationProps } from '../../../context/InstallIntegrationContext';
import { ConfigureState, ObjectConfigurationsState } from '../types';

import {
  resetAllObjectsConfigurationState,
} from './utils';

// Create a context for the configuration state
const ConfigurationContext = createContext<{
  objectConfigurationsState: ObjectConfigurationsState;
  setObjectConfigurationsState: React.Dispatch<React.SetStateAction<ObjectConfigurationsState>>;
  setConfigureState:(objectName: string, configureState: ConfigureState) => void;

} | undefined>(undefined);

const initalObjectConfigurationsState: ObjectConfigurationsState = {};

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
  ] = useState<ObjectConfigurationsState>(initalObjectConfigurationsState);
  const config = installation?.config;

  useEffect(() => {
    // set configurationState when hydratedRevision is loaded
    if (hydratedRevision?.content?.actions && !loading) {
      resetAllObjectsConfigurationState(
        hydratedRevision,
        config,
        setObjectConfigurationsState,
      );
    }
  }, [hydratedRevision, loading, config]);

  // set configure state of single object
  const setConfigureState = useCallback((objectName: string, configureState: ConfigureState) => {
    setObjectConfigurationsState((prevState) => ({
      ...prevState,
      [objectName]: configureState,
    }));
  }, [setObjectConfigurationsState]);

  const contextValue = useMemo(
    () => ({
      objectConfigurationsState,
      setObjectConfigurationsState,
      setConfigureState,
    }),
    [objectConfigurationsState, setConfigureState],
  );

  return (
    <ConfigurationContext.Provider value={contextValue}>
      {children}
    </ConfigurationContext.Provider>
  );
}
