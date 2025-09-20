import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { Draft, produce } from "immer";

import { WRITE_CONST } from "../nav/ObjectManagementNav/constant";
import { ConfigureState, ObjectConfigurationsState } from "../types";

import { useHydratedRevision } from "./HydratedRevisionContext";
import { resetAllObjectsConfigurationState } from "./utils";
// Create a context for the configuration state
export const ConfigurationContext = createContext<
  | {
      objectConfigurationsState: ObjectConfigurationsState;
      setObjectConfigurationsState: React.Dispatch<
        React.SetStateAction<ObjectConfigurationsState>
      >;
      setConfigureState: (
        objectName: string,
        producer: (draft: Draft<ConfigureState>) => void,
      ) => void;
      resetConfigureState: (
        objectName: string,
        configureState: ConfigureState,
      ) => void;
      resetPendingConfigurationState: (objectName: string) => void;
    }
  | undefined
>(undefined);

const initialObjectConfigurationsState: ObjectConfigurationsState = {};

/**
 * Custom hook to access and update the configuration state for all objects
 */
export function useObjectsConfigureState() {
  const context = useContext(ConfigurationContext);
  if (!context) {
    throw new Error(
      "useObjectsConfigureState must be used within a ConfigurationProvider",
    );
  }
  return context;
}

type ConfigurationProviderProps = {
  children: React.ReactNode;
};

// Create a provider component for the configuration context
export function ConfigurationProvider({
  children,
}: ConfigurationProviderProps) {
  const { installation } = useInstallIntegrationProps();
  const { hydratedRevision, loading } = useHydratedRevision();

  // 1. get config from installations (contains form selection state)
  // 2. get the hydrated revision from installation revisionId (contains full form)
  // 3. generate the configuration state from the hydrated revision and config

  const [objectConfigurationsState, setObjectConfigurationsState] =
    useState<ObjectConfigurationsState>(initialObjectConfigurationsState);
  const config = installation?.config;

  useEffect(() => {
    // set configurationState when hydratedRevision is loaded
    // only reset when objectConfigurationsState does not exist
    if (
      hydratedRevision?.content &&
      !loading &&
      config &&
      !(Object.entries(objectConfigurationsState).length > 0)
    ) {
      resetAllObjectsConfigurationState(
        hydratedRevision,
        config,
        setObjectConfigurationsState,
      );
    }
  }, [hydratedRevision, loading, config, objectConfigurationsState]);

  // mutate configure state of single object using a producer method
  const setConfigureState = useCallback(
    (objectName: string, producer: (draft: Draft<ConfigureState>) => void) => {
      // consider moving check modified state here
      setObjectConfigurationsState((currentState) =>
        produce(currentState, (draft) => {
          // immer exception when mutating a draft

          draft[objectName] = produce(draft[objectName], producer);
        }),
      );
    },
    [setObjectConfigurationsState],
  );

  // set configure state of single object by assigning a new state
  const resetConfigureState = useCallback(
    (objectName: string, configureState: ConfigureState) => {
      setObjectConfigurationsState((currentState) =>
        produce(currentState, (draft) => {
          // immer exception when mutating a draft

          draft[objectName] = configureState;
        }),
      );
    },
    [setObjectConfigurationsState],
  );

  const resetWritePendingConfigurationState = useCallback(() => {
    setObjectConfigurationsState(
      produce((draft) => {
        const writeDraft = draft.other.write;
        if (writeDraft) {
          writeDraft.isWriteModified = false;
        }
      }),
    );
  }, [setObjectConfigurationsState]);

  const resetReadPendingConfigurationState = useCallback(
    (objectName: string) => {
      setObjectConfigurationsState(
        produce((draft) => {
          const readDraft = draft[objectName]?.read;
          if (readDraft) {
            readDraft.isOptionalFieldsModified = false;
            readDraft.isRequiredMapFieldsModified = false;
          }
        }),
      );
    },
    [setObjectConfigurationsState],
  );

  // set configure state of single object
  const resetPendingConfigurationState = useCallback(
    (objectName: string) => {
      // write case
      if (objectName === WRITE_CONST) {
        resetWritePendingConfigurationState();
      } else {
        // read case
        resetReadPendingConfigurationState(objectName);
      }
    },
    [resetReadPendingConfigurationState, resetWritePendingConfigurationState],
  );

  const contextValue = useMemo(
    () => ({
      objectConfigurationsState,
      setObjectConfigurationsState,
      setConfigureState,
      resetConfigureState,
      resetPendingConfigurationState,
    }),
    [
      objectConfigurationsState,
      resetConfigureState,
      resetPendingConfigurationState,
      setConfigureState,
    ],
  );

  return (
    <ConfigurationContext.Provider value={contextValue}>
      {children}
    </ConfigurationContext.Provider>
  );
}
