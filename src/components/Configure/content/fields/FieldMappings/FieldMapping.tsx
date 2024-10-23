import { useEffect, useMemo, useState } from 'react';
import { Select as ChakraSelect } from '@chakra-ui/react';

import { HydratedIntegrationFieldExistent, IntegrationFieldMapping } from 'services/api';
import { ComboBox } from 'src/components/ui-base/ComboBox/ComboBox';
import { isChakraRemoved } from 'src/components/ui-base/constant';

import { useSelectedConfigureState } from '../../useSelectedConfigureState';

import { setFieldMapping } from './setFieldMapping';

interface FieldMappingProps {
  field: IntegrationFieldMapping,
  onSelectChange: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void,
  allFields: HydratedIntegrationFieldExistent[],
}

export function FieldMapping(
  { field, onSelectChange, allFields }: FieldMappingProps,
) {
  const { configureState, selectedObjectName, setConfigureState } = useSelectedConfigureState();
  const [disabled, setDisabled] = useState(true);

  const selectedRequiredMapFields = configureState?.read?.selectedFieldMappings;
  const fieldValue = selectedRequiredMapFields?.[field.mapToName];

  useEffect(() => {
    /* eslint no-underscore-dangle: ["error", { "allow": ["_default"] }] */
    if (!!field._default && !fieldValue && selectedObjectName && !!configureState) {
      // set field mapping default value if no value exists
      setFieldMapping(selectedObjectName, setConfigureState, field.mapToName, field._default);
    }
    setDisabled(false);
  }, [field, setConfigureState, selectedObjectName, fieldValue, configureState]);

  const options = useMemo(() => allFields?.map(
    (f) => <option key={f.fieldName} value={f.fieldName}>{f.displayName}</option>,
  ), [allFields]);

  const items = useMemo(() => allFields.map((f) => ({
    id: f.fieldName,
    label: f.displayName,
    value: f.fieldName,
  })), [allFields]);

  const SelectComponent = isChakraRemoved ? (
    <ComboBox
      items={items}
      selectedValue={fieldValue || null}
      onSelectedItemChange={(item) => {
        onSelectChange({
          target: {
            name: field.mapToName,
            value: item?.value,
          } as unknown as HTMLSelectElement,
        } as unknown as React.ChangeEvent<HTMLSelectElement>);
      }}
      placeholder={!fieldValue ? 'Please select one' : fieldValue}
    />
  ) : (
    <ChakraSelect
      name={field.mapToName}
      variant="flushed"
      value={fieldValue || undefined}
      onChange={onSelectChange}
      placeholder={!fieldValue ? 'Please select one' : undefined} // remove placeholder when value is selected
      disabled={disabled}
    >
      {options}
    </ChakraSelect>
  );

  return (
    <div key={field.mapToName} style={{ display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontWeight: 500 }}>{field.mapToDisplayName}</h3>
      <p style={{ paddingBottom: '1rem' }}>{field?.prompt}</p>
      {SelectComponent}
    </div>
  );
}
