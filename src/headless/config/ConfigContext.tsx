import { createContext, ReactNode, useContext } from "react";
import type { UpdateInstallationConfigContent } from "@generated/api/src";

import { useConfigHelper } from "./useConfigHelper";

const ConfigContext = createContext<ReturnType<typeof useConfigHelper> | null>(
  null,
);

export function ConfigProvider({
  children,
  initialConfig,
}: {
  children: ReactNode;
  initialConfig: UpdateInstallationConfigContent;
}) {
  const config = useConfigHelper(initialConfig);
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error(
      "useConfigContext must be used within a ConfigProvider / InstallationProvider",
    );
  }
  return context;
}
