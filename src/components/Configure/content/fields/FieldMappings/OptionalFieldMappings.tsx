import { useMemo } from 'react';

import { ErrorBoundary, useErrorState } from 'context/ErrorContextProvider';
import { FormControl } from 'src/components/form/FormControl';
import { useInstallIntegrationProps } from 'src/context/InstallIntegrationContextProvider';
import { IntegrationFieldMapping } from 'src/services/api';

import { useSelectedConfigureState } from '../../useSelectedConfigureState';
import { FieldHeader } from '../FieldHeader';

import { FieldMapping } from './FieldMapping';
import { setFieldMapping } from './setFieldMapping';

export function OptionalFieldMappings() {
  const { selectedObjectName, configureState, setConfigureState } = useSelectedConfigureState();
  const { isError, removeError } = useErrorState();

  const { fieldMapping } = useInstallIntegrationProps();

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    if (!value) {
      // if place holder value is chosen, we don't change state
      return;
    }

    if (selectedObjectName) {
      setFieldMapping(selectedObjectName, setConfigureState, [
        {
          field: name,
          value,
        },
      ]);
    }

    if (isError(ErrorBoundary.MAPPING, name)) {
      removeError(ErrorBoundary.MAPPING, name);
    }
  };

  const integrationFieldMappings = useMemo(() => {
    const optionalFieldMappings = configureState?.read?.optionalMapFields || [];
    // 2. Extract dynamic field mappings for the selected object name from the fieldMapping object if it exists
    const dynamicFieldMappings = selectedObjectName && fieldMapping
      ? Object.values(fieldMapping[selectedObjectName] || {})
        .flat()
        .filter((mapping) => !mapping.fieldName)
      : [];

    // 3. Combine dynamic field mappings with the optional map fields from configureState
    const combinedFieldMappings = optionalFieldMappings
      .concat(dynamicFieldMappings)
      // 4. Remove duplicates based on mapToName and keep the latest item
      .reduce((acc, item) => {
        const existingItem = acc.find((i) => i.mapToName === item.mapToName);
        if (existingItem) return acc.map((i) => (i.mapToName === item.mapToName ? item : i));
        return acc.concat(item);
      }, new Array<IntegrationFieldMapping>());

    return combinedFieldMappings;
  }, [configureState, fieldMapping, selectedObjectName]);

  return integrationFieldMappings?.length ? (
    <>
      <FieldHeader string="Map the following optional fields" />
      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        {integrationFieldMappings.map((field) => (
          <FormControl id={field.mapToName} key={field.mapToName}>
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
