import { useState } from 'react';

import { Input } from 'src/components/form/Input';
import { Button } from 'src/components/ui-base/Button';

import { NewDefaultValueUI } from './NewDefaultValueUI';

interface FieldDefaultValueRowProps {
  objectName: string,
}

type FieldDefaultValue = {
  field: string,
  fieldDisplayName: string,
  defaultValue: string,
};

export function FieldDefaultValueTable({
  objectName,
}: FieldDefaultValueRowProps) {
  const [defaultValueList, setDefaultValueList] = useState<FieldDefaultValue[]>([]);

  const onAddDefaultValue = (field: string, fieldDisplayName: string, defaultValue: string) => {
    if (defaultValueList.some((df) => df.field === field)) {
      console.error(`Field ${field} already has a default value. Delete to update field default value.`);
      return;
    }
    setDefaultValueList((prev) => [...prev, { field, fieldDisplayName, defaultValue }]);
  };

  const onDeleteDefaultValue = (field: string) => {
    setDefaultValueList((prev) => prev.filter((df) => df.field !== field));
  };

  return (
    <>
      <div style={{
        paddingBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '.5rem',
      }}
      >
        {defaultValueList.length === 0 && <div>No default values</div>}
        {defaultValueList?.length > 0 && (
        <div style={{ height: '1rem' }}>
          <div>Field Default Values</div>
        </div>
        )}
        {defaultValueList.map(({ field, fieldDisplayName, defaultValue: df }) => (
          <div
            key={`${field}-${df}`}
            style={{ display: 'flex', flexDirection: 'row', gap: '.25rem' }}
          >
            <Input id={field} type="text" disabled value={fieldDisplayName} style={{ width: '100%' }} />
            <Input id={`${field}-${df}`} type="text" disabled value={df} style={{ width: '10rem' }} />
            <Button
              type="button"
              variant="ghost"
              onClick={() => onDeleteDefaultValue(field)}
            >
              x
            </Button>
          </div>
        ))}
      </div>
      <NewDefaultValueUI objectName={objectName} onAddDefaultValue={onAddDefaultValue} />
    </>
  );
}
