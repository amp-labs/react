import { useEffect, useMemo, useState } from 'react';

import { HydratedIntegrationFieldExistent, IntegrationFieldMapping } from 'services/api';
import { ComboBox } from 'src/components/ui-base/ComboBox/ComboBox';
import { LabelTooltip } from 'src/components/ui-base/Tooltip';

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
      setFieldMapping(selectedObjectName, setConfigureState, [{
        field: field.mapToName,
        value: field._default,
        idDeleted: false,
      }]);
    }
    setDisabled(false);
  }, [field, setConfigureState, selectedObjectName, fieldValue, configureState]);

  const items = useMemo(() => allFields.map((f) => ({
    id: f.fieldName,
    label: f.displayName,
    value: f.fieldName,
  })), [allFields]);

  const SelectComponent = (
    <ComboBox
      disabled={disabled}
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
      placeholder="Please select one"
    />
  );

  return (
    <div key={field.mapToName} style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex', flexDirection: 'row', gap: '.25rem', marginBottom: '.25rem',
      }}
      >
        <span style={{ fontWeight: 500 }}>{field.mapToDisplayName}</span>
        <span>
          {field?.prompt && <LabelTooltip id={`tooltip-id-${field?.prompt}`} tooltipText={field?.prompt} />}
        </span>
      </div>
      {SelectComponent}
    </div>
  );
}
