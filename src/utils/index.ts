import { map, reduce } from 'lodash';

import { Integration } from '../services/api';
import {
  DataField,
  DataFields,
  FieldConfig,
  IntegrationConfig,
  ObjectConfig,
  ObjectConfigOptions,
  OptionalDataField,
} from '../types/configTypes';

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Given the name of an integration, return the integration object
 *
 * @param integrationName {string} Name of the integration.
 * @param integrations {Integration[]} List of integrations.
 * @returns {Integration | null}
 */
export const findIntegrationFromList = (
  integrationName: string,
  integrations: Integration[],
) : Integration | null => {
  if (integrations?.length === 0 || !integrationName) return null;

  return integrations.find(
    (s: Integration) => s.name === integrationName,
  ) ?? null;
};

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

// Redirect page to another URL, can be relative (e.g. `/login`) or absolute (e.g. `https://www.google.com`).
export const redirectTo = (url: string) => {
  window.location.href = url;
};
