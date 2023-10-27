import {
  HydratedIntegrationField,
  HydratedIntegrationFieldExistent,
  IntegrationFieldMapping,
} from '../../services/api';

export type ConfigureStateIntegrationField = HydratedIntegrationFieldExistent & {
  value: string | number | boolean | null,
};

export type ConfigureStateMappingIntegrationField = IntegrationFieldMapping & {
  value: string | number | undefined,
};

export type SelectOptionalFields = {
  [key: string]: boolean,
};

export type ConfigureState = {
  allFields: HydratedIntegrationFieldExistent[] | null, // needed for custom mapping
  requiredFields: HydratedIntegrationField[] | null,
  optionalFields: ConfigureStateIntegrationField[] | null,
  requiredMapFields: ConfigureStateMappingIntegrationField[] | null,
  selectedOptionalFields: SelectOptionalFields | null,
};

// maps to all object keys in hydrated revision
export type ObjectConfigurationsState = Record<string, ConfigureState>;

// standard object name and whether it is completed in the ObjectManagementNav
export type NavObject = {
  name: string;
  completed: boolean;
};
