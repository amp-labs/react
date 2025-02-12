import {
  useCallback, useEffect, useMemo, useState,
} from 'react';

import {
  HydratedIntegrationFieldExistent,
  IntegrationFieldMapping,
} from 'services/api';
import { Button } from 'src/components/ui-base/Button';
import { ComboBox } from 'src/components/ui-base/ComboBox/ComboBox';
import { LabelTooltip } from 'src/components/ui-base/Tooltip';
import { ErrorBoundary, useErrorState } from 'src/context/ErrorContextProvider';

import { useSelectedConfigureState } from '../../useSelectedConfigureState';

import { setFieldMapping } from './setFieldMapping';

export const DUPLICATE_FIELD_ERROR_MESSAGE = 'Each field must be mapped to a unique value';

interface FieldMappingProps {
  field: IntegrationFieldMapping;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  allFields: HydratedIntegrationFieldExistent[];
}

export function FieldMapping({
  field,
  onSelectChange,
  allFields,
}: FieldMappingProps) {
  const { configureState, selectedObjectName, setConfigureState } = useSelectedConfigureState();
  const [disabled, setDisabled] = useState(true);
  const { isError, removeError, getError } = useErrorState();
  const selectedFieldMappings = configureState?.read?.selectedFieldMappings;
  const fieldValue = selectedFieldMappings?.[field.mapToName];

  useEffect(() => {
    /* eslint no-underscore-dangle: ["error", { "allow": ["_default"] }] */
    if (!!field._default && !fieldValue && selectedObjectName && !!configureState) {
      // set field mapping default value if no value exists
      setFieldMapping(selectedObjectName, setConfigureState, [
        {
          field: field.mapToName,
          value: field._default,
        },
      ]);
    }
    setDisabled(false);
  }, [
    field,
    setConfigureState,
    selectedObjectName,
    fieldValue,
    configureState,
  ]);

  const items = useMemo(
    () => allFields.map((f) => ({
      id: f.fieldName,
      label: f.displayName,
      value: f.fieldName,
    })),
    [allFields],
  );

  const SelectComponent = (
    <ComboBox
      disabled={disabled}
      items={items}
      selectedValue={fieldValue || null}
      onSelectedItemChange={(item) => {
        onSelectChange({
          target: {
            name: field.mapToName,
            value: item?.value,
          } as unknown as HTMLSelectElement,
        } as unknown as React.ChangeEvent<HTMLSelectElement>);
      }}
      placeholder="Please select one"
      style={{ width: '100%' }}
    />
  );

  const onClear = useCallback(() => {
    if (selectedObjectName) {
      setFieldMapping(selectedObjectName, setConfigureState, [
        {
          field: field.mapToName,
          value: null, // clear value; may reset to default
        },
      ]);

      if (isError(ErrorBoundary.MAPPING, selectedObjectName)) {
        removeError(ErrorBoundary.MAPPING, selectedObjectName);
      }
    }
  }, [
    field.mapToName,
    selectedObjectName,
    setConfigureState,
    isError,
    removeError,
  ]);

  // Errors are tracked per field by storing an array of field names that have errors
  // under the selectedObjectName key in the error boundary. If a field name exists
  // in this array, it means that field has a duplicate mapping error.
  const { hasDuplicationError, errorMessage } = useMemo(() => {
    const errs = getError(ErrorBoundary.MAPPING, selectedObjectName!);
    const hasDupErrors = Array.isArray(errs) && errs.length > 0 && errs.includes(field.mapToName);
    return {
      hasDuplicationError: hasDupErrors,
      errorMessage: hasDupErrors ? DUPLICATE_FIELD_ERROR_MESSAGE : '',
    };
  }, [selectedObjectName, getError, field.mapToName]);

  return (
    <>
      <div
        key={field.mapToName}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '.25rem',
          marginBottom: '.25rem',
        }}
        >
          <span style={{ fontWeight: 500 }}>{field.mapToDisplayName}</span>
          <span>
            {field?.prompt && <LabelTooltip id={`tooltip-id-${field?.prompt}`} tooltipText={field?.prompt} />}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '.25rem' }}>
          {SelectComponent}
          <Button type="button" variant="ghost" onClick={onClear}>
            clear
          </Button>
        </div>
      </div>
      {hasDuplicationError
      && (<span key={field.mapToName} style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}> {errorMessage} </span>)}
    </>
  );
}
