import { useCallback, useMemo } from "react";
import { ComboBox } from "src/components/ui-base/ComboBox/ComboBox";

import { useSelectedConfigureState } from "../../useSelectedConfigureState";

import { setValueMapping } from "./setValueMapping";

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
}

export function ValueMappingItem({
  mappedValue,
  onSelectChange,
  fieldName,
  allValueOptions,
}: ValueMappingItemProps) {
  const { configureState, selectedObjectName, setConfigureState } =
    useSelectedConfigureState();

  const selectedValueMappingForField = useMemo(
    () => configureState?.read?.selectedValueMappings?.[fieldName] || {},
    [configureState?.read?.selectedValueMappings, fieldName],
  );

  const fieldValue = useMemo(
    () => selectedValueMappingForField?.[mappedValue.mappedValue],
    [selectedValueMappingForField, mappedValue.mappedValue],
  );

  const items = useMemo(
    () =>
      allValueOptions.map((f) => ({
        id: f.value,
        label: f.displayValue,
        value: f.value,
      })),
    [allValueOptions],
  );

  const onValueChange = useCallback(
    (item: { value: string } | null) => {
      if (item) {
        onSelectChange({
          target: {
            name: mappedValue.mappedValue,
            value: item.value,
            fieldName,
          } as unknown as HTMLSelectElement,
        } as unknown as React.ChangeEvent<HTMLSelectElement>);
      } else if (selectedObjectName) {
        setValueMapping(
          selectedObjectName,
          setConfigureState,
          mappedValue.mappedValue,
          "",
          fieldName,
        );
      }
    },
    [
      onSelectChange,
      fieldName,
      mappedValue.mappedValue,
      selectedObjectName,
      setConfigureState,
    ],
  );

  const SelectComponent = useMemo(
    () => (
      <ComboBox
        key={fieldValue}
        items={items}
        selectedValue={fieldValue || null}
        onSelectedItemChange={onValueChange}
        placeholder="Please select one"
        style={{
          borderRadius: "8px",
          width: "100%",
        }}
        clearable
      />
    ),
    [fieldValue, items, onValueChange],
  );

  return (
    <div
      key={mappedValue.mappedValue}
      style={{
        display: "flex",
        flexDirection: "column",
        marginBottom: ".25rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: ".25rem",
          marginBottom: ".25rem",
        }}
      >
        <span style={{ fontWeight: 500 }}>
          {mappedValue.mappedDisplayValue}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: ".25rem" }}>
        {SelectComponent}
      </div>
    </div>
  );
}
