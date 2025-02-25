import { useCallback, useMemo } from 'react';

import { HydratedIntegrationRead } from 'services/api';
import { useHydratedRevision } from 'src/components/Configure/state/HydratedRevisionContext';
import { getObjectFromAction } from 'src/components/Configure/utils';
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
  defaultValue: string | boolean | number,
};

/**
 *
 * gets field displayName from hydrated revision, object.allFields
 * fallback to field name if not found
 *  */
const getDisplayNameFromField = (
  field: string,
  objectName: string,
  readAction: HydratedIntegrationRead,
) => {
  const object = readAction && getObjectFromAction(readAction, objectName);
  const allFieldsMetadata = object?.allFieldsMetadata;
  return allFieldsMetadata?.[field]?.displayName || field;
};

function convertToStringOrNumber(value: string | number | boolean): (string | number) {
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  return value;
}

export function FieldDefaultValueTable({
  objectName,
}: FieldDefaultValueRowProps) {
  const { readAction } = useHydratedRevision();
  const { selectedObjectName, configureState, setConfigureState } = useSelectedConfigureState();
  const selectedWriteObjects = configureState?.write?.selectedWriteObjects;
  const writeObject = selectedWriteObjects?.[objectName];
  const selectedValueDefaultsMap = useMemo(() => writeObject?.selectedValueDefaults || {}, [writeObject]);

  const onAddDefaultValue = useCallback((field: string, fieldDisplayName: string, defaultValue: string | number) => {
    setValueDefaultWriteField(selectedObjectName || '', objectName, field, defaultValue, setConfigureState);
  }, [objectName, selectedObjectName, setConfigureState]);

  const onDeleteDefaultValue = (field: string) => {
    setValueDefaultWriteField(selectedObjectName || '', objectName, field, null, setConfigureState);
  };

  const defaultValueList: FieldDefaultValue[] = Object.keys(selectedValueDefaultsMap).map((field) => ({
    field,
    defaultValue: selectedValueDefaultsMap[field]?.value?.toString(),
    // consider memoizing if performance is an issue.
    fieldDisplayName: readAction ? getDisplayNameFromField(field, objectName, readAction) : field,
  }));

  return (
    <>
      <div style={{
        paddingBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '.5rem',
      }}
      >
        {defaultValueList.map(({ field, fieldDisplayName, defaultValue: df }) => (
          <div
            key={`${field}-${df}`}
            style={{ display: 'flex', flexDirection: 'row', gap: '.25rem' }}
          >
            <Input id={field} type="text" disabled value={fieldDisplayName} style={{ width: '100%' }} />
            <Input id={`${field}-${df}`} type="text" disabled value={convertToStringOrNumber(df)} style={{ width: '10rem' }} />
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
      <div style={{
        textAlign: 'right',
        padding: '.25rem 0',
        color: 'var(--amp-colors-text-muted)',
      }}
      >click + to confirm
      </div>
    </>
  );
}
