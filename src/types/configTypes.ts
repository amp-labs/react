/* eslint-disable no-use-before-define */
// TODO - reorder types to match this rule
export type SourceList = {
  appName: string;
  integrations: Array<IntegrationSource>;
};
export interface IntegrationSource {
  name: string;
  type: 'read' | 'write';
  api: string;
  objects: ObjectConfigOptions[];
}

export interface ObjectConfigOptions {
  name: DataObject;
  requiredFields?: DataFields;
  optionalFields?: OptionalDataField[];
  customFieldMapping?: FieldMappingOption[];
}

export type DataFields = Array<DataField>;

type DataObjectName = string;
type DataFieldName = string;
type DataObjectDisplayName = string;
type DataFieldDisplayName = string;

export interface DataObject {
  objectName: DataObjectName;
  displayName: DataObjectDisplayName;
}

export interface DataField {
  fieldName: DataFieldName;
  displayName: DataFieldDisplayName;
}

export interface OptionalDataField extends DataField {
  isDefaultSelected: boolean;
}

export interface FieldMappingOption {
  mapToName: string;
  mapToDisplayName: string;
  prompt: string;
  choices: DataField[];
}

export interface ObjectConfig {
  objectName: DataObjectName;
  requiredFields: FieldConfig;
  selectedOptionalFields: FieldConfig;
  selectedFieldMapping?: { [mapTo: string]: DataFieldName }
}

export interface FieldConfig {
  [fieldName: DataFieldName]: boolean;
}

export type IntegrationConfig = Array<ObjectConfig>;

export interface SubdomainContextConfig {
  subdomain: string;
  setSubdomain: React.Dispatch<React.SetStateAction<string>>;
}

export interface ConnectedToProviderType {
  [provider: string]: boolean | null;
}
