import {
  HydratedIntegrationField,
  HydratedIntegrationFieldExistent,
  IntegrationFieldMapping,
} from '../../services/api';

// type SelectedNonConfigurableWriteFields = {
//   [key: string]: boolean,
// };

// write state slice
// type ConfigureStateWrite = {
//   selectedNonConfigurableWriteFields: SelectedNonConfigurableWriteFields | null,
// };

export type SelectOptionalFields = {
  [key: string]: boolean,
};

export type SelectMappingFields = {
  [key: string]: string | undefined,
};

type ConfigureStateRead = {
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

type SavedConfigureState = {
  optionalFields: SelectOptionalFields,
  requiredMapFields: SelectMappingFields,
};

export type ConfigureState = {
  // read state slice
  read: ConfigureStateRead | null,
  // separating write for possible state slice
  // write: ConfigureStateWrite | null,
};

// maps to all object keys in hydrated revision
export type ObjectConfigurationsState = Record<string, ConfigureState>;

// standard object name and whether it is completed in the ObjectManagementNav
export type NavObject = {
  name: string;
  completed: boolean;
};
