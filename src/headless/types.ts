/**
 * This file is a collection of types that are used in the headless SDK.
 * It re-exports types from the generated API types and from the config/useConfigHelper.ts file.
 * This is done to provide a single import for all types used in the SDK.
 */

// Re-export types from the generated API types
import type {
  BaseReadConfigObject,
  BaseWriteConfigObject,
  ConfigContent,
  Connection,
  FieldMetadata,
  FieldSetting,
  FieldSettingDefault,
  FieldSettingWriteOnCreateEnum,
  FieldSettingWriteOnUpdateEnum,
  HydratedIntegrationField,
  HydratedIntegrationObject,
  HydratedRevision,
  Installation,
  UpdateInstallationConfigContent,
} from "@generated/api/src";

// Re-export types from their original source files
export type { InstallationContextValue } from "./InstallationProvider";
export type { InstallationConfigContent } from "./config/types";
export type {
  ReadObjectHandlers,
  WriteObjectHandlers,
} from "./config/useConfigHelper";
export type { Manifest } from "./manifest/useManifest";

// Re-export generated types that are commonly used
export type {
  BaseReadConfigObject,
  BaseWriteConfigObject,
  ConfigContent,
  Connection,
  FieldMetadata,
  FieldSetting,
  FieldSettingDefault,
  FieldSettingWriteOnCreateEnum,
  FieldSettingWriteOnUpdateEnum,
  HydratedIntegrationField,
  HydratedIntegrationObject,
  HydratedRevision,
  Installation,
  UpdateInstallationConfigContent,
};
