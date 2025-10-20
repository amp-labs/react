// Installation Provider
export { InstallationProvider } from "./InstallationProvider";

// Connection
export { useConnection } from "./useConnection";

// Installation Hooks
export { useInstallation } from "./installation/useInstallation";
export { useInstallationValidation } from "./installation/useInstallationValidation";
export { useCreateInstallation } from "./installation/useCreateInstallation";
export { useUpdateInstallation } from "./installation/useUpdateInstallation";
export { useDeleteInstallation } from "./installation/useDeleteInstallation";

// Manifest Hooks
export { useManifest } from "./manifest/useManifest";

// Config Hooks
export { useConfig, useLocalConfig } from "./config/ConfigContext";

// Config Bridge Types
export type { InstallationConfigContent } from "./config/types";

// Export all necessary types
export * from "./types";
