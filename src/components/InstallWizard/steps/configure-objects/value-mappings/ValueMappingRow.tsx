import { useMemo } from "react";
import type { FieldValue } from "@generated/api/src";
import { ComboBox } from "src/components/ui-base/ComboBox/ComboBox";

import styles from "./valueMappings.module.css";

interface ValueMappingRowProps {
  /** The app value being mapped (its human-readable label). */
  sourceDisplayValue: string;
  /** Available provider values to map onto. */
  options: FieldValue[];
  /** Currently selected provider value, if any. */
  selectedValue: string | undefined;
  /** Called with the chosen provider value, or "" to clear. */
  onChange: (targetValue: string) => void;
}

export function ValueMappingRow({
  sourceDisplayValue,
  options,
  selectedValue,
  onChange,
}: ValueMappingRowProps) {
  const items = useMemo(
    () =>
      options.map((option) => ({
        id: option.value,
        label: option.displayValue,
        value: option.value,
      })),
    [options],
  );

  return (
    <div className={styles.valueMappingRow}>
      <span className={styles.valueMappingLabel}>{sourceDisplayValue}</span>
      <ComboBox
        items={items}
        selectedValue={selectedValue || null}
        onSelectedItemChange={(item) => onChange(item?.value ?? "")}
        placeholder="Please select one"
        clearable
      />
    </div>
  );
}
