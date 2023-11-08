import {
  HydratedIntegrationField,
  HydratedIntegrationFieldExistent,
  IntegrationFieldMapping,
} from '../../services/api';

export type SelectOptionalFields = {
  [key: string]: boolean,
};

export type SelectMappingFields = {
  [key: string]: string | undefined,
};

type SavedConfigureState = {
  optionalFields: SelectOptionalFields,
  requiredMapFields: SelectMappingFields,
};

export type ConfigureState = {
  allFields: HydratedIntegrationFieldExistent[] | null, // needed for custom mapping
  requiredFields: HydratedIntegrationField[] | null,
  optionalFields: HydratedIntegrationField[] | null,
  requiredMapFields: IntegrationFieldMapping[] | null,
  selectedOptionalFields: SelectOptionalFields | null,
  selectedFieldMappings: SelectMappingFields | null,
  isOptionalFieldsModified: boolean, // checks if selected optional fields is modified
  isRequiredMapFieldsModified: boolean, // checks if required map fields is modified
  savedConfig: SavedConfigureState, // check when to know if config is saved / modified
};

// maps to all object keys in hydrated revision
export type ObjectConfigurationsState = Record<string, ConfigureState>;

// standard object name and whether it is completed in the ObjectManagementNav
export type NavObject = {
  name: string;
  completed: boolean;
};
