import { useMemo } from 'react';
import { ErrorBoundary, useErrorState } from 'context/ErrorContextProvider';
import { FormControl } from 'src/components/form/FormControl';

import { useSelectedConfigureState } from '../../useSelectedConfigureState';
import { FieldHeader } from '../FieldHeader';

import { checkDuplicateFieldError } from './checkDuplicateFieldError';
import { FieldMappingRow } from './FieldMappingRow';
import { setFieldMapping } from './setFieldMapping';

export function RequiredFieldMappings() {
  const { selectedObjectName, configureState, setConfigureState } = useSelectedConfigureState();
  const { isError, removeError, setError } = useErrorState();
  const selectedFieldMappings = configureState?.read?.selectedFieldMappings;
  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    if (!value) {
      // if place holder value is chosen, we don't change state
      return;
    }

    const hasDuplicateError = checkDuplicateFieldError({
      selectedFieldMappings,
      selectedObjectName,
      fieldName: name,
      fieldValue: value,
      setError,
    });

    if (hasDuplicateError) return;

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

    // reset duplicate value errors for the selected object
    if (
      selectedObjectName
      && isError(ErrorBoundary.MAPPING, selectedObjectName)
    ) {
      removeError(ErrorBoundary.MAPPING, selectedObjectName);
    }
  };

  const integrationFieldMappings = useMemo(
    () => configureState?.read?.requiredMapFields || [],
    [configureState],
  );

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
            <FieldMappingRow
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
