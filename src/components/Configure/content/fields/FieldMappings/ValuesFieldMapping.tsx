import { useEffect, useMemo, useState } from 'react';

import { ComboBox } from 'src/components/ui-base/ComboBox/ComboBox';

import { useSelectedConfigureState } from '../../useSelectedConfigureState';

interface ValuesFieldMappingProps {
  value: any,
  fieldName: any,
  onSelectChange: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void,
  allValues: any[],
}

export function ValuesFieldMapping(
  {
    value, onSelectChange, fieldName, allValues,
  }: ValuesFieldMappingProps,
) {
  const { configureState, selectedObjectName, setConfigureState } = useSelectedConfigureState();
  const [disabled, setDisabled] = useState(true);

  const fieldValue = useMemo(
    () => {
      const selectedValueMappings = configureState?.read?.selectedValueMappings || {};
      return selectedValueMappings?.[fieldName]?.[value.mappedValue];
    },
    [configureState?.read?.selectedValueMappings, fieldName, value.mappedValue],
  );

  useEffect(() => {
    setDisabled(false);
  }, [value, setConfigureState, selectedObjectName, fieldValue, configureState]);

  const items = useMemo(() => allValues.map((f) => ({
    id: f.value,
    label: f.displayValue,
    value: f.value,
  })), [allValues]);

  const SelectComponent = useMemo(() => (
    <ComboBox
      disabled={disabled}
      items={items}
      selectedValue={fieldValue || null}
      onSelectedItemChange={(item) => {
        onSelectChange({
          target: {
            name: value.mappedValue,
            value: item?.value,
            fieldName,
          } as unknown as HTMLSelectElement,
        } as unknown as React.ChangeEvent<HTMLSelectElement>);
      }}
      placeholder="Please select one"
    />
  ), [items, fieldValue, value, fieldName, disabled, onSelectChange]);

  return (
    <div key={value.mappedValue} style={{ display: 'flex', flexDirection: 'column', marginBottom: '.25rem' }}>
      <div style={{
        display: 'flex', flexDirection: 'row', gap: '.25rem', marginBottom: '.25rem',
      }}
      >
        <span style={{ fontWeight: 500 }}>{value.mappedDisplayValue}</span>
      </div>
      {SelectComponent}
    </div>
  );
}
