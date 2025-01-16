import { useEffect, useMemo, useState } from 'react';

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
}

export function ValueMappingItem(
  {
    mappedValue, onSelectChange, fieldName, allValueOptions,
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

  const SelectComponent = useMemo(() => (
    <ComboBox
      disabled={disabled}
      items={items}
      selectedValue={fieldValue || null}
      onSelectedItemChange={(item) => {
        if (Object.values(selectedValueMappingForField).some((mapping) => mapping === item!.value)) {
          console.error(`Each ${fieldName} must be mapped to a unique value`);
          return;
        }

        onSelectChange({
          target: {
            name: mappedValue.mappedValue,
            value: item?.value,
            fieldName,
          } as unknown as HTMLSelectElement,
        } as unknown as React.ChangeEvent<HTMLSelectElement>);
      }}
      placeholder="Please select one"
    />
  ), [disabled, items, fieldValue, selectedValueMappingForField, onSelectChange, mappedValue.mappedValue, fieldName]);

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
