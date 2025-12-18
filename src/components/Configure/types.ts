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

// ConfigureStateWrite contains relevant information from the Revision and current Config
// which are useful for generating the new config state.
// It currently tracks all write objects instead of just a single object.
export type ConfigureStateWrite = {
  writeObjects: HydratedIntegrationWriteObject[] | null;
  selectedWriteObjects: SelectedWriteObjects | null;
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

// ConfigureStateRead contains relevant information from the Revision and current Config
// which are useful for generating the new config state.
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

// ConfigureState contains relevant information from the Revision and current Config
// which are useful for generating the new config state.
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
