export type SourceList = Array<IntegrationSource>

export interface IntegrationSource {
  name: string;
  type: 'read' | 'write';
  api: string;
  objects: ObjectConfigOptions[];
}

export interface ObjectConfigOptions {
  name: DataObject;
  requiredFields?: DataField[];
  optionalFields?: OptionalDataField[];
  customFieldMapping?: FieldMappingOption[];
}

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

export interface OptionalDataField {
  fieldName: DataFieldName;
  displayName: DataFieldDisplayName;
  default: 'selected' | 'unselected';
}

export interface FieldMappingOption {
  mapToName: string;
  mapToDisplayName: string;
  prompt: string;
  choices: DataField[];
}

export interface IntegrationConfig {
  [object: DataObjectName]: ObjectConfig
}

export interface ObjectConfig {
  selectedOptionalFields: { [mapTo: DataFieldName]: boolean }
  selectedFieldMapping: { [mapTo: string]: DataFieldName }
}

export interface SubdomainContextConfig {
  subdomain: string | null;
  setSubdomain: any;
}
