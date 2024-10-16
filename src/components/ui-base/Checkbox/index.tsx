import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon, DividerHorizontalIcon } from '@radix-ui/react-icons';

import styles from './checkbox.module.css'; // CSS module for styling

type CheckboxFieldProps = {
  id: string;
  isChecked?: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
};

export function CheckboxField({
  id, isChecked, label, onCheckedChange,
}: CheckboxFieldProps) {
  return (
    <div className={styles.fieldContainer}>
      <Checkbox.Root
        className={styles.checkbox}
        id={id}
        onCheckedChange={onCheckedChange}
        checked={isChecked}
      >
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label htmlFor={id} style={{overflowWrap: "anywhere"}}>{label}</label>
    </div>
  );
}

type SelectAllCheckboxProps = {
  id: string;
  isChecked?: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
  isIndeterminate: boolean;
};

export function SelectAllCheckbox({
  id, isChecked, label, onCheckedChange, isIndeterminate,
}: SelectAllCheckboxProps) {
  return (
    <div className={styles.selectAllContainer}>
      <Checkbox.Root
        className={styles.checkbox}
        id={id}
        onCheckedChange={onCheckedChange}
      >
        <Checkbox.Indicator>
          {isIndeterminate && <DividerHorizontalIcon />}
          {isChecked === true && <CheckIcon />}
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

/**
 * Container for all checkbox fields and select all checkbox
 * @param param0
 * @returns
 */
export function CheckboxGroup({ children }: { children: React.ReactNode }) {
  return <div className={styles.checkboxGroupContainer}>{children}</div>;
}

/**
 * Container for all checkbox fields
 * @param param0
 * @returns
 */
export function CheckboxFieldsContainer({ children }: { children: React.ReactNode }) {
  return <div className={styles.stack}>{children}</div>;
}

//  Example layout for CheckboxGroup, CheckboxFieldsContainer, CheckboxField, and SelectAllCheckbox
/**
 *

```tsx
const fields = [
    { fieldDisplayName: 'Field 1', fieldName: 'field1' },
    { fieldDisplayName: 'Field 2', fieldName: 'field2' },
];
<CheckboxGroup>
  <SelectAllCheckbox />
  <CheckboxFieldsContainer>
    {fields.map((field) => {<CheckboxField />}
    </CheckboxFieldsContainer>
</CheckboxGroup>
```

*/
