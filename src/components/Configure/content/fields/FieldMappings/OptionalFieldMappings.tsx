import { useMemo } from 'react';

import { ErrorBoundary, useErrorState } from 'context/ErrorContextProvider';
import { FormControl } from 'src/components/form/FormControl';
import { useInstallIntegrationProps } from 'src/context/InstallIntegrationContextProvider';

import { useSelectedConfigureState } from '../../useSelectedConfigureState';
import { FieldHeader } from '../FieldHeader';

import { DynamicFieldMappings } from './DynamicFieldMappings';
import { FieldMapping } from './FieldMapping';
import { setFieldMapping } from './setFieldMapping';

export function OptionalFieldMappings() {
  const { selectedObjectName, configureState, setConfigureState } = useSelectedConfigureState();
  const { isError, removeError } = useErrorState();
  const allFields = configureState?.read?.allFields || [];
  const { fieldMapping } = useInstallIntegrationProps();

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    if (!value) {
      // if place holder value is chosen, we don't change state
      return;
    }

    if (selectedObjectName) {
      setFieldMapping(selectedObjectName, setConfigureState, [{ field: name, value }]);
    }

    if (isError(ErrorBoundary.MAPPING, name)) {
      removeError(ErrorBoundary.MAPPING, name);
    }
  };

  const dynamicFieldMappings = useMemo(() => {
    if (!selectedObjectName || !fieldMapping) return [];

    return Object.values(fieldMapping[selectedObjectName] || {})
      .flat()
      .filter((mapping) => !mapping.fieldName);
  }, [fieldMapping, selectedObjectName]);

  const integrationFieldMappings = useMemo(() => {
    const optionalFieldMappings = configureState?.read?.optionalMapFields || [];

    /**
     * Incase there's an overlap of field mappings for a field (say pronoun in contacts object)
     * in static as well as dynamic,
     * We'd use the fieldMapping configuration from the dynamic fields as that would take precedence.
     * So we filter out any optionalFieldMappings that exist in dynamicFieldMappings
     */
    const combinedFieldMappings = optionalFieldMappings.filter(
      (optionalField) => !dynamicFieldMappings.some(
        (dynamicField) => dynamicField.mapToName === optionalField.mapToName,
      ),
    );

    return combinedFieldMappings;
  }, [configureState, dynamicFieldMappings]);

  const showDynamicFieldMappings = dynamicFieldMappings.length > 0;
  const showIntegrationFieldMappings = integrationFieldMappings.length > 0;

  return (showIntegrationFieldMappings || showDynamicFieldMappings) ? (
    <>
      <FieldHeader string="Map the following optional fields" />
      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        {integrationFieldMappings?.map((field) => (
          <FormControl id={field.mapToName} key={field.mapToName}>
            <FieldMapping
              allFields={allFields}
              field={field}
              onSelectChange={onSelectChange}
            />
          </FormControl>
        ))}
        {showDynamicFieldMappings && (
          <DynamicFieldMappings
            dynamicFieldMappings={dynamicFieldMappings}
            onSelectChange={onSelectChange}
            allFields={allFields}
          />
        )}
      </div>
    </>
  ) : null;
}
