import { FormControl } from 'src/components/form/FormControl';
import { ErrorBoundary, useErrorState } from 'src/context/ErrorContextProvider';
import { HydratedIntegrationFieldExistent, IntegrationFieldMapping } from 'src/services/api';

import { DUPLICATE_FIELD_ERROR_MESSAGE, FieldMapping } from './FieldMapping';

export function DynamicFieldMappings({
  dynamicFieldMappings,
  onSelectChange,
  allFields,
  selectedObjectName,
}: {
  dynamicFieldMappings: IntegrationFieldMapping[];
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  allFields: HydratedIntegrationFieldExistent[];
  selectedObjectName: string
}) {
  const { getError } = useErrorState();
  const errors = getError(ErrorBoundary.MAPPING, selectedObjectName!);

  // eslint-disable-next-line no-console
  console.log('ERRORS', errors);
  return dynamicFieldMappings.length ? (
    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
      {dynamicFieldMappings.map((field) => (
        <FormControl id={field.mapToName} key={field.mapToName}>
          <FieldMapping
            allFields={allFields}
            field={field}
            onSelectChange={onSelectChange}
            hasError={Array.isArray(errors) && errors.includes(field.mapToName)}
            errorMessage={DUPLICATE_FIELD_ERROR_MESSAGE}
          />
        </FormControl>
      ))}
    </div>
  ) : null;
}
