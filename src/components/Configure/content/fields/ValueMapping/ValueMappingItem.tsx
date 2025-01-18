import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { produce } from 'immer';

import { ComboBox } from 'src/components/ui-base/ComboBox/ComboBox';

import { useSelectedConfigureState } from '../../useSelectedConfigureState';

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
  onSelectChange: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  allValueOptions: ValueOption[];
  hasError?: boolean;
  setErrors: any;
  errors: any;
}

export function ValueMappingItem(
  {
    mappedValue, onSelectChange, fieldName, allValueOptions,
    hasError, setErrors, errors,
  }: ValueMappingItemProps,
) {
  const { configureState, selectedObjectName, setConfigureState } = useSelectedConfigureState();
  const [disabled, setDisabled] = useState(true);

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
  }, [mappedValue, setConfigureState, selectedObjectName, fieldValue, configureState]);

  const items = useMemo(() => allValueOptions.map((f) => ({
    id: f.value,
    label: f.displayValue,
    value: f.value,
  })), [allValueOptions]);

  const onValueChange = useCallback(
    (item: { value: string } | null) => {
      if (!item) return;

      if (Object.values(selectedValueMappingForField)
        .some((mapping) => mapping === item.value && mapping !== fieldValue)) {
        const duplicateKeys = [
          ...Object.entries(selectedValueMappingForField)
            .filter(([_, mapping]) => mapping === item.value && mapping !== fieldValue)
            .map(([key]) => key),
          mappedValue.mappedValue,
        ];

        setErrors(produce((draft: any) => {
          if (!draft[fieldName]) {
          // eslint-disable-next-line no-param-reassign
            draft[fieldName] = {};
          }
          duplicateKeys.forEach((key) => {
          // eslint-disable-next-line no-param-reassign
            draft[fieldName][key] = `Each ${fieldName} must be mapped to a unique value`;
          });
        }));
        return;
      }

      if (errors[fieldName]) {
      // Reset error when validation passes
        setErrors(produce((draft: any) => {
        // eslint-disable-next-line no-param-reassign
          draft[fieldName] = {};
        }));
      }

      onSelectChange({
        target: {
          name: mappedValue.mappedValue,
          value: item.value,
          fieldName,
        } as unknown as HTMLSelectElement,
      } as unknown as React.ChangeEvent<HTMLSelectElement>);
    },
    [onSelectChange, selectedValueMappingForField, fieldValue, fieldName, mappedValue.mappedValue, errors, setErrors],
  );

  const SelectComponent = useMemo(() => (
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
      }}
    />
  ), [fieldValue, disabled, items, onValueChange, hasError]);

  return (
    <div key={mappedValue.mappedValue} style={{ display: 'flex', flexDirection: 'column', marginBottom: '.25rem' }}>
      <div style={{
        display: 'flex', flexDirection: 'row', gap: '.25rem', marginBottom: '.25rem',
      }}
      >
        <span style={{ fontWeight: 500 }}>{mappedValue.mappedDisplayValue}</span>
      </div>
      {SelectComponent}
    </div>
  );
}
