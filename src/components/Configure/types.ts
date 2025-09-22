import {
  BaseWriteConfigObject,
  HydratedIntegrationField,
  HydratedIntegrationFieldExistent,
  HydratedIntegrationWriteObject,
  IntegrationFieldMapping,
} from "services/api";

export type SelectedWriteObjects = {
  [objectName: string]: BaseWriteConfigObject;
};

type SavedWriteConfigureState = {
  selectedWriteObjects: SelectedWriteObjects;
};

// write state slice
// currently tracks all write objects insteaad of just a single objectname
export type ConfigureStateWrite = {
  writeObjects: HydratedIntegrationWriteObject[] | null;
  selectedWriteObjects: SelectedWriteObjects | null;
  isWriteModified: boolean;
  savedConfig: SavedWriteConfigureState; // check when to know if config is saved / modified
};

export type SelectOptionalFields = {
  [key: string]: boolean;
};

export type SelectMappingFields = {
  [key: string]: string | undefined;
};

export type SelectValueMappings = {
  [fieldName: string]: { [mappedValue: string]: string };
};

export type ConfigureStateRead = {
  allFields: HydratedIntegrationFieldExistent[] | null; // needed for custom mapping
  allFieldsMetadata: any; // needed for values mapping // TODO: better types.
  requiredFields: HydratedIntegrationField[] | null;
  optionalFields: HydratedIntegrationField[] | null;
  requiredMapFields: IntegrationFieldMapping[] | null;
  optionalMapFields: IntegrationFieldMapping[] | null;
  selectedOptionalFields: SelectOptionalFields | null;
  selectedFieldMappings: SelectMappingFields | null;
  selectedValueMappings: SelectValueMappings | null;
};

export type ConfigureState = {
  // read state slice
  read: ConfigureStateRead | null;
  // separating write for possible state slice in the future
  write: ConfigureStateWrite | null;
};

// maps to all object keys in hydrated revision
export type ObjectConfigurationsState = Record<string, ConfigureState>;

// standard object name and whether it is completed in the ObjectManagementNav
export type NavObject = {
  name: string;
  displayName?: string;
  completed: boolean;
};
