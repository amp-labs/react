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
  OptionalDataField,
} from '../components/types/configTypes';

/* eslint-disable-next-line */
export const findSourceFromList = (integrationName: string, sourceList: SourceList) => {
  return sourceList.find((s: IntegrationSource) => s.name === integrationName);
};

// eslint-disable-next-line max-len
export const findObjectInIntegrationConfig = (object: ObjectConfigOptions, integrationConfig: IntegrationConfig): ObjectConfig | undefined => integrationConfig.find(
  (objectToSet: ObjectConfig) => objectToSet.objectName === object.name.objectName,
);

export const getDefaultConfigForSource = (objects: ObjectConfigOptions[]): IntegrationConfig => map(
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
    (fieldsAcc: FieldConfig, dataField: DataField | OptionalDataField) => {
      let fieldValue = true;
      if ((dataField as OptionalDataField).default === 'unselected') fieldValue = false;
      fieldsAcc[dataField.fieldName] = fieldValue; // eslint-disable-line no-param-reassign
      return fieldsAcc;
    },
    {} as FieldConfig,
  );
};
