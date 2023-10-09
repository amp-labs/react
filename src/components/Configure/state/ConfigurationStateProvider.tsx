import React, {
  createContext, useContext, useEffect, useMemo,
  useState,
} from 'react';

import { useHydratedRevision } from '../../../context/HydratedRevisionContext';
import { Config } from '../../../services/api';
import { useSelectedObjectName } from '../ObjectManagementNav';
import { ConfigureState } from '../types';

import {
  resetConfigurationState,
} from './utils';

// Create a context for the configuration state
export const ConfigurationContext = createContext<{
  configureState: ConfigureState;
  setConfigureState: React.Dispatch<React.SetStateAction<ConfigureState>>;
} | undefined>(undefined);

const initialConfigureState: ConfigureState = {
  allFields: null,
  requiredFields: null,
  optionalFields: null,
  requiredCustomMapFields: null,
};

// Custom hook to access and update the configuration state
export function useConfigureState() {
  const context = useContext(ConfigurationContext);
  if (!context) {
    throw new Error('useConfigureState must be used within a ConfigurationProvider');
  }
  return context;
}

type ConfigurationProviderProps = {
  config?: Config;
  children: React.ReactNode;
};

// Create a provider component for the configuration context
export function ConfigurationProvider(
  { config, children }: ConfigurationProviderProps,
) {
  const { hydratedRevision, loading } = useHydratedRevision();
  const { selectedObjectName } = useSelectedObjectName();
  // 1. get config from installations (contains form selection state)
  // 2. get the hydrated revision from installation revisionId (contains full form)
  // 3. generate the configuration state from the hydrated revision and config
  const [configureState, setConfigureState] = useState<ConfigureState>(initialConfigureState);

  useEffect(() => {
    // set configurationState when hydratedRevision is loaded
    if (hydratedRevision?.content?.actions && !loading && selectedObjectName) {
      resetConfigurationState(hydratedRevision, config, selectedObjectName, setConfigureState);
    }
  }, [hydratedRevision, loading, selectedObjectName, config]);

  const contextValue = useMemo(
    () => ({ configureState, setConfigureState }),
    [configureState, setConfigureState],
  );

  return (
    <ConfigurationContext.Provider value={contextValue}>
      {children}
    </ConfigurationContext.Provider>
  );
}
