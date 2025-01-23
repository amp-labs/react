import { useEffect } from 'react';

import { useInstallIntegrationProps } from 'src/context/InstallIntegrationContextProvider';

import { useSelectedConfigureState } from '../../useSelectedConfigureState';

import { setFieldMapping } from './setFieldMapping';

const findOutdatedKeys = (
  selectedKeys: string[],
  allowedKeysSet: Set<string>,
) => selectedKeys.filter((key) => !allowedKeysSet.has(key));

/**
 *  Custom hook to unset values for old field mappings:
 *
 *  Active field mappings come from required mappings, optional mappings, and dynamic mappings.
 *  Old mappings may still exists in the config even after removing them from the amp.yaml file
 *  or dyanmic mappings
 *
 *  This hook will unset the values for old field mappings that are no longer allowed by the builder
 *  (i.e. old amp.yaml / dynamic mapping configs keys)
 */
export function useClearOldFieldMappings() {
  const { selectedObjectName, configureState, setConfigureState } = useSelectedConfigureState();
  const { fieldMapping } = useInstallIntegrationProps();

  // Get field mappings with user selected values
  const selectedFieldMappings = configureState?.read?.selectedFieldMappings || {};
  const selectedKeys = Object.keys(selectedFieldMappings); // may include outdated keys from config

  // Get allowed fields (not oudated) from required mappings, optional mappings, and dynamic mappings
  const requiredFieldMappings = configureState?.read?.requiredMapFields || [];
  const optionalFieldMappings = configureState?.read?.optionalMapFields || [];
  const dynamicFieldMappings = selectedObjectName && fieldMapping
    ? Object.values(fieldMapping[selectedObjectName] || {}).flat().filter((mapping) => !mapping.fieldName) : [];

  // merge all allowed keys
  const allowedKeys = requiredFieldMappings
    .concat(dynamicFieldMappings, optionalFieldMappings)
    .map((field) => field.mapToName);

  // create a set for faster lookup, remove duplicates
  const allowKeysSet = new Set(allowedKeys);

  // find keys that are outdated
  const outdatedKeys = findOutdatedKeys(selectedKeys, allowKeysSet);

  useEffect(() => {
    if (!!selectedObjectName && outdatedKeys.length) {
      // For old field mappings that have now been removed by the builder, unset the values for those keys.
      setFieldMapping(selectedObjectName, setConfigureState, outdatedKeys.map((key) => ({
        field: key,
        value: null,
      })));
    }
  }, [selectedObjectName, setConfigureState, outdatedKeys]);
}
