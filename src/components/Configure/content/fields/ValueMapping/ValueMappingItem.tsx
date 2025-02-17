import {
  useCallback, useEffect, useMemo, useState,
} from 'react';

import { Button } from 'src/components/ui-base/Button';
import { ComboBox } from 'src/components/ui-base/ComboBox/ComboBox';
import { ErrorBoundary, useErrorState } from 'src/context/ErrorContextProvider';

import { useSelectedConfigureState } from '../../useSelectedConfigureState';

import { setValueMapping } from './setValueMapping';

interface MappedValue {
  mappedValue: string;
  mappedDisplayValue: string;
}

interface ValueOption {
  value: string;
  displayValue: string;
}

interface ValueMappingItemProps {
  mappedValue: MappedValue;
  fieldName: string;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  allValueOptions: ValueOption[];
  hasError?: boolean;
}

export function ValueMappingItem({
  mappedValue,
  onSelectChange,
  fieldName,
  allValueOptions,
  hasError,
}: ValueMappingItemProps) {
  const { configureState, selectedObjectName, setConfigureState } = useSelectedConfigureState();
  const [disabled, setDisabled] = useState(true);

  const {
    getError, setError, resetBoundary, isError, removeError,
  } = useErrorState();

  const selectedValueMappingForField = useMemo(
    () => configureState?.read?.selectedValueMappings?.[fieldName] || {},
    [configureState?.read?.selectedValueMappings, fieldName],
  );

  const fieldValue = useMemo(
    () => selectedValueMappingForField?.[mappedValue.mappedValue],
    [selectedValueMappingForField, mappedValue.mappedValue],
  );

  useEffect(() => {
    setDisabled(false);
  }, [
    mappedValue,
    setConfigureState,
    selectedObjectName,
    fieldValue,
    configureState,
  ]);

  const items = useMemo(
    () => allValueOptions.map((f) => ({
      id: f.value,
      label: f.displayValue,
      value: f.value,
    })),
    [allValueOptions],
  );

  const onValueChange = useCallback(
    (item: { value: string } | null) => {
      if (!item) return;

      // check if the value is already mapped to another field
      if (
        Object.values(selectedValueMappingForField).some(
          (mapping) => mapping === item.value && mapping !== fieldValue,
        )
      ) {
        // Find all the fields that have the same value that need to shown as
        // error'ed out fields
        const duplicateKeys = [
          ...Object.entries(selectedValueMappingForField)
            .filter(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ([_, mapping]) => mapping === item.value && mapping !== fieldValue,
            )
            .map(([key]) => key),
          mappedValue.mappedValue,
        ];

        // Set error for all the fields that have the same value
        setError(ErrorBoundary.VALUE_MAPPING, fieldName, duplicateKeys);
        return;
      }

      if (getError(ErrorBoundary.VALUE_MAPPING, fieldName)) {
        // if you're here in the code, it means that the value is not already mapped to another field
        // so we can remove the error for all the fields that have the same value
        resetBoundary(ErrorBoundary.VALUE_MAPPING);
      }

      onSelectChange({
        target: {
          name: mappedValue.mappedValue,
          value: item.value,
          fieldName,
        } as unknown as HTMLSelectElement,
      } as unknown as React.ChangeEvent<HTMLSelectElement>);
    },
    [
      onSelectChange,
      selectedValueMappingForField,
      fieldValue,
      fieldName,
      mappedValue.mappedValue,
      resetBoundary,
      setError,
      getError,
    ],
  );

  const SelectComponent = useMemo(
    () => (
      <ComboBox
        key={fieldValue}
        disabled={disabled}
        items={items}
        selectedValue={fieldValue || null}
        onSelectedItemChange={onValueChange}
        placeholder="Please select one"
        style={{
          border: hasError ? '2px solid red' : undefined,
          borderRadius: '8px',
          width: '100%',
        }}
      />
    ),
    [fieldValue, disabled, items, onValueChange, hasError],
  );

  const onClear = useCallback(() => {
    if (selectedObjectName) {
      setValueMapping(selectedObjectName, setConfigureState, mappedValue.mappedValue, '', fieldName);

      if (isError(ErrorBoundary.VALUE_MAPPING, fieldName)) {
        removeError(ErrorBoundary.VALUE_MAPPING, fieldName);
      }
    }
  }, [selectedObjectName, setConfigureState, mappedValue.mappedValue, fieldName, isError, removeError]);
  return (
    <div
      key={mappedValue.mappedValue}
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '.25rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '.25rem',
          marginBottom: '.25rem',
        }}
      >
        <span style={{ fontWeight: 500 }}>
          {mappedValue.mappedDisplayValue}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '.25rem' }}>
        {SelectComponent}
        <Button type="button" variant="ghost" onClick={onClear}>Clear</Button>
      </div>
    </div>
  );
}
