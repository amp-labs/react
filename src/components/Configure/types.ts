import {
  HydratedIntegrationField,
  HydratedIntegrationFieldExistent,
  HydratedIntegrationWriteObject,
  IntegrationFieldMapping,
} from 'services/api';

export type SelectedNonConfigurableWriteFields = {
  [key: string]: boolean,
};

type SavedWriteConfigureState = {
  selectedNonConfigurableWriteFields: SelectedNonConfigurableWriteFields,
};

// write state slice
export type ConfigureStateWrite = {
  writeObjects: HydratedIntegrationWriteObject[] | null,
  selectedNonConfigurableWriteFields: SelectedNonConfigurableWriteFields | null,
  isWriteModified: boolean,
  savedConfig: SavedWriteConfigureState, // check when to know if config is saved / modified
};

export type SelectOptionalFields = {
  [key: string]: boolean,
};

export type SelectMappingFields = {
  [key: string]: string | undefined,
};

export type SelectValueMappings = {
  [key: string]: any | undefined,
};

export type ConfigureStateRead = {
  allFields: HydratedIntegrationFieldExistent[] | null, // needed for custom mapping
  allFieldsMetadata: any, // needed for values mapping // TODO: better types.
  requiredFields: HydratedIntegrationField[] | null,
  optionalFields: HydratedIntegrationField[] | null,
  requiredMapFields: IntegrationFieldMapping[] | null,
  optionalMapFields: IntegrationFieldMapping[] | null,
  selectedOptionalFields: SelectOptionalFields | null,
  selectedFieldMappings: SelectMappingFields | null,
  selectedValueMappings: SelectValueMappings | null,
  isOptionalFieldsModified: boolean, // checks if selected optional fields is modified
  isRequiredMapFieldsModified: boolean, // checks if required map fields is modified
  savedConfig: SavedConfigureState, // check when to know if config is saved / modified
};

type SavedConfigureState = {
  optionalFields: SelectOptionalFields,
  requiredMapFields: SelectMappingFields,
};

export type ConfigureState = {
  // read state slice
  read: ConfigureStateRead | null,
  // separating write for possible state slice
  write: ConfigureStateWrite | null,
};

// maps to all object keys in hydrated revision
export type ObjectConfigurationsState = Record<string, ConfigureState>;

// standard object name and whether it is completed in the ObjectManagementNav
export type NavObject = {
  name: string;
  displayName?: string;
  completed: boolean;
};
