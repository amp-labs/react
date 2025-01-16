import { useMemo } from 'react';
import { IntegrationFieldMapping } from '@generated/api/src';

import { ErrorBoundary, useErrorState } from 'context/ErrorContextProvider';
import { FormControl } from 'src/components/form/FormControl';
import { useInstallIntegrationProps } from 'src/context/InstallIntegrationContextProvider';

import { useSelectedConfigureState } from '../../useSelectedConfigureState';
import { FieldHeader } from '../FieldHeader';

import { FieldMapping } from './FieldMapping';
import { setFieldMapping } from './setFieldMapping';

const findDeprecatedKeys = (selectedKeys: string[], allowedKeys: string[]) => selectedKeys.filter((key) => !allowedKeys.includes(key));

export function RequiredFieldMappings() {
  const { selectedObjectName, configureState, setConfigureState } = useSelectedConfigureState();
  const { fieldMapping } = useInstallIntegrationProps();
  const { isError, removeError } = useErrorState();

  const integrationFieldMappings = useMemo(() => {
    // 1. Extract required map fields from configureState
    const requiredFieldMappings = configureState?.read?.requiredMapFields || [];

    // 2. Extract dynamic field mappings for the selected object name from the fieldMapping object if it exists
    const dynamicFieldMappings = selectedObjectName && fieldMapping
      ? Object.values(fieldMapping[selectedObjectName] || {}).flat()
      : [];

    // 3. Combine dynamic field mappings with the required map fields from configureState
    const combinedFieldMappings = requiredFieldMappings.concat(dynamicFieldMappings)
      // 4. Remove duplicates based on mapToName and keep the latest item
      .reduce((acc, item) => {
        const existingItem = acc.find((i) => i.mapToName === item.mapToName);
        if (existingItem) return acc.map((i) => (i.mapToName === item.mapToName ? item : i));
        return acc.concat(item);
      }, new Array<IntegrationFieldMapping>());

    return combinedFieldMappings;
  }, [configureState, fieldMapping, selectedObjectName]);

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    if (!value) {
      // if place holder value is chosen, we don't change state
      return;
    }

    if (selectedObjectName) {
      setFieldMapping(selectedObjectName, setConfigureState, [{
        field: name,
        value,
        idDeleted: false,
      }]);
    }

    if (isError(ErrorBoundary.MAPPING, name)) {
      removeError(ErrorBoundary.MAPPING, name);
    }
  };

  const selectedFieldMappings = configureState?.read?.selectedFieldMappings || {};
  const selectedKeys = Object.keys(selectedFieldMappings);
  const allowedKeys = integrationFieldMappings.map((field) => field.mapToName);

  const deprecatedKeys = findDeprecatedKeys(selectedKeys, allowedKeys);

  if (!!selectedObjectName && deprecatedKeys.length) {
    setFieldMapping(selectedObjectName, setConfigureState, deprecatedKeys.map((key) => ({
      field: key,
      value: '',
      idDeleted: true,
    })));

    return null;
  }

  return integrationFieldMappings?.length ? (
    <>
      <FieldHeader string="Map the following fields" />
      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        {integrationFieldMappings.map((field) => (
          <FormControl
            id={field.mapToName}
            key={field.mapToName}
            isInvalid={isError(ErrorBoundary.MAPPING, field.mapToName)}
            errorMessage="* required"
          >
            <FieldMapping
              allFields={configureState?.read?.allFields || []}
              field={field}
              onSelectChange={onSelectChange}
            />
          </FormControl>
        ))}
      </div>
    </>
  ) : null;
}
