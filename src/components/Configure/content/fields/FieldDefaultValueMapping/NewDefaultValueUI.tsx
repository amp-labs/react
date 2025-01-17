import { useMemo, useState } from 'react';
import { HydratedIntegrationFieldExistent } from '@generated/api/src';

import { useHydratedRevision } from 'src/components/Configure/state/HydratedRevisionContext';
import { getObjectFromAction } from 'src/components/Configure/utils';
import { Input } from 'src/components/form/Input';
import { Button } from 'src/components/ui-base/Button';
import { ComboBox } from 'src/components/ui-base/ComboBox/ComboBox';

type FieldOption = {
  label: string;
  value: string;
};

type NewDefaultValueUIProps = {
  objectName: string;
  onAddDefaultValue: (field: string, displayFieldName: string, defaultValue: string) => void;
};

export function NewDefaultValueUI({ objectName, onAddDefaultValue }: NewDefaultValueUIProps) {
  const { readAction, loading } = useHydratedRevision();
  const [selectedField, setSelectedField] = useState<FieldOption | null>(null);
  const [newDefaultValue, setNewDefaultValue] = useState<string>('');

  const object = readAction && getObjectFromAction(readAction, objectName);
  const allFields = useMemo(
    () => object?.allFields as HydratedIntegrationFieldExistent[] || [],
    [object],
  );

  const isDisabled = loading || !allFields || allFields.length === 0;

  const items = useMemo(() => (allFields).map((f) => ({
    id: f.fieldName,
    label: f.displayName,
    value: f.fieldName,
  })), [allFields]);

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    if (!value) {
      // if place holder value is chosen, we don't change state
      return;
    }
    setSelectedField({ label: name, value });
  };

  const onDefaultValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewDefaultValue(value);
  };

  const onAddDefaultValueHelper = () => {
    if (newDefaultValue && selectedField?.value) {
      onAddDefaultValue(selectedField?.value, selectedField.label, newDefaultValue);
      // reset new default value state
      setSelectedField(null);
      setNewDefaultValue('');
    }
  };
  const SelectComponet = (
    <ComboBox
      style={{ width: '100%' }}
      disabled={isDisabled}
      items={items}
      selectedValue={selectedField?.value || null}
      onSelectedItemChange={(item) => {
        onSelectChange({
          target: {
            name: item?.label,
            value: item?.value,
          } as HTMLSelectElement,
        } as React.ChangeEvent<HTMLSelectElement>);
      }}
      placeholder="Please select field."
    />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '.25rem' }}>
      {SelectComponet}
      <Input
        id="new-default-value"
        type="text"
        value={newDefaultValue}
        onChange={onDefaultValueChange}
        style={{ width: '10rem' }}
        placeholder="default value"
      />
      <Button type="button" onClick={onAddDefaultValueHelper} variant="ghost">+</Button>
    </div>
  );
}
