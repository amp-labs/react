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

/**
 * Given the name of an integration, return the matching source configuration.
 *
 * @param integrationName {string} Name of the integration.
 * @param sourceList {SourceList} List of sources.
 * @returns {IntegrationSource | null}
 */
export const findSourceFromList = (
  integrationName: string,
  sourceList: SourceList,
) : IntegrationSource | null => sourceList.integrations.find(
  (s: IntegrationSource) => s.name === integrationName,
) ?? null;

/**
 * Finder function to locate the right object in the source.
 *
 * @param object {ObjectConfigOptions}
 * @param integrationConfig {IntegrationConfig}
 * @returns {ObjectConfig | undefined}
 */
export const findObjectInIntegrationConfig = (
  object: ObjectConfigOptions,
  integrationConfig: IntegrationConfig,
): ObjectConfig | undefined => integrationConfig.find(
  (objectToSet: ObjectConfig) => objectToSet.objectName === object.name.objectName,
);

/**
 * Given a source, create the config payload to be saved.
 * Gets rid of extra data like display names.
 *
 * @param objects {ObjectConfigOptions[]} Array of object config options.
 * @returns {ObjectConfig} Config payload for source.
 */
export const getDefaultConfigForSource = (
  objects: ObjectConfigOptions[],
): IntegrationConfig => map(
  objects,
  (object: ObjectConfigOptions): ObjectConfig => ({
    objectName: object.name.objectName,
    requiredFields: reduceDataFieldsToFieldConfig(object.requiredFields) || {},
    selectedOptionalFields: reduceDataFieldsToFieldConfig(object.optionalFields) || {},
    selectedFieldMapping: {}, // SET BY USER IN CONFIGURE FLOW
  }),
);

/**
 * Create config payload for data fields.
 *
 * @param fields {DataFields} Config parameter.
 * @returns {FieldConfig | null} Config payload.
 */
const reduceDataFieldsToFieldConfig = (fields?: DataFields): FieldConfig | null => {
  if (!fields) return null;
  return reduce(
    fields,
    (fieldsAcc: FieldConfig, dataField: DataField | OptionalDataField) => {
      const config = fieldsAcc;
      config[dataField.fieldName] = (dataField as OptionalDataField).isDefaultSelected || true;
      return config;
    },
    {} as FieldConfig,
  );
};

// Redirect page to another URL, can be relative (e.g. `/login`) or absolute (e.g. `https://www.google.com`).
export const redirectTo = (url: string) => {
  window.location.href = url;
}
