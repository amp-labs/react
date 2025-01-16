import { useMemo } from 'react';

import { ErrorBoundary, useErrorState } from 'context/ErrorContextProvider';
import { FormControl } from 'src/components/form/FormControl';

import { useSelectedConfigureState } from '../../useSelectedConfigureState';
import { FieldHeader } from '../FieldHeader';

import { FieldMapping } from './FieldMapping';
import { setFieldMapping } from './setFieldMapping';

export function OptionalFieldMappings() {
  const { selectedObjectName, configureState, setConfigureState } = useSelectedConfigureState();
  const { isError, removeError } = useErrorState();

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
          idDeleted: false,
        },
      ]);
    }

    if (isError(ErrorBoundary.MAPPING, name)) {
      removeError(ErrorBoundary.MAPPING, name);
    }
  };

  const integrationFieldMappings = useMemo(
    () => configureState?.read?.optionalMapFields || [],
    [configureState],
  );

  return integrationFieldMappings?.length ? (
    <>
      <FieldHeader string="Map the following optional fields" />
      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        {integrationFieldMappings.map((field) => (
          <FormControl
            id={field.mapToName}
            key={field.mapToName}
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
