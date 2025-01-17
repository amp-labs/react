import { useCallback, useMemo } from 'react';

import { Input } from 'src/components/form/Input';
import { Button } from 'src/components/ui-base/Button';

import { useSelectedConfigureState } from '../../useSelectedConfigureState';

import { NewDefaultValueUI } from './NewDefaultValueUI';
import { setValueDefaultWriteField } from './setValueDefaultWriteField';

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
  const { selectedObjectName, configureState, setConfigureState } = useSelectedConfigureState();
  const selectedWriteObjects = configureState?.write?.selectedWriteObjects;
  const writeObject = selectedWriteObjects?.[objectName];
  const selectedValueDefaultsMap = useMemo(() => writeObject?.selectedValueDefaults || {}, [writeObject]);

  const onAddDefaultValue = useCallback((field: string, fieldDisplayName: string, defaultValue: string) => {
    setValueDefaultWriteField(selectedObjectName || '', objectName, field, defaultValue, setConfigureState);
  }, [objectName, selectedObjectName, setConfigureState]);

  const onDeleteDefaultValue = (field: string) => {
    setValueDefaultWriteField(selectedObjectName || '', objectName, field, null, setConfigureState);
  };

  const defaultValueList: FieldDefaultValue[] = Object.keys(selectedValueDefaultsMap).map((field) => ({
    field,
    defaultValue: selectedValueDefaultsMap[field],
    fieldDisplayName: field, // update to use field display name
  }));

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
