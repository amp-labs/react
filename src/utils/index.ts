import { map, reduce } from 'lodash';
import {
  DataField,
  DataFields,
  FieldConfig,
  SourceList,
  IntegrationConfig,
  IntegrationSource,
  ObjectConfig,
  ObjectConfigOptions,
} from '../components/types/configTypes';

/* eslint-disable-next-line */
export const findSourceFromList = (integrationName: string, sourceList: SourceList) => {
  return sourceList.find((s: IntegrationSource) => s.name === integrationName);
};

export const mapIntegrationSourceToConfig = (objects: ObjectConfigOptions[]): IntegrationConfig => map(
  objects,
  (object: ObjectConfigOptions): ObjectConfig => ({
    objectName: object.name.objectName,
    requiredFields: reduceDataFieldsToFieldConfig(object.requiredFields) || {},
    selectedOptionalFields: reduceDataFieldsToFieldConfig(object.optionalFields) || {},
    selectedFieldMapping: {}, // SET BY USER IN CONFIGURE FLOW
  }),
);

const reduceDataFieldsToFieldConfig = (fields?: DataFields): FieldConfig | null => {
  if (!fields) return null;
  return reduce(
    fields,
    (fieldsAcc: FieldConfig, dataField: DataField) => {
      fieldsAcc[dataField.fieldName] = true; // eslint-disable-line no-param-reassign
      return fieldsAcc;
    },
    {} as FieldConfig,
  );
};
