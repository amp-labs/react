import { createContext, ReactNode, useContext } from "react";

import type { InstallationConfigContent } from "./types";
import { useConfigHelper } from "./useConfigHelper";

const ConfigContext = createContext<ReturnType<typeof useConfigHelper> | null>(
  null,
);

export function ConfigProvider({
  children,
  initialConfig,
}: {
  children: ReactNode;
  initialConfig: InstallationConfigContent;
}) {
  const config = useConfigHelper(initialConfig);
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
}

/**
 * useLocalConfig is used to manage a local draft state of the config
 * it's used to manage the config state with getters, setters, and resetters
 * @returns {
 *  draft: InstallationConfigContent;
 *  get: () => InstallationConfigContent;
 *  reset: () => void;
 *  setDraft: (draft: InstallationConfigContent) => void;
 *  readObject: (objectName: string) => BaseReadConfigObject | undefined;
 *  writeObject: (objectName: string) => BaseWriteConfigObject | undefined;
 *  proxy: () => ProxyHandlers;
 * }
 */
export function useLocalConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error(
      "useLocalConfig must be used within a ConfigProvider / InstallationProvider",
    );
  }
  return context;
}

/**
 * legacy hook for backwards compatibility (same as useLocalConfig)
 * @deprecated
 * @returns
 */
export function useConfig() {
  console.warn("useConfig is deprecated. Please use useLocalConfig instead.");
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error(
      "useConfigContext must be used within a ConfigProvider / InstallationProvider",
    );
  }
  return context;
}
