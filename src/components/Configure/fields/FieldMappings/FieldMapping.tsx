import { useEffect, useMemo, useState } from 'react';
import {
  Select, Stack, Text,
} from '@chakra-ui/react';

import { HydratedIntegrationFieldExistent } from '../../../../services/api';
import { useSelectedObjectName } from '../../ObjectManagementNav';
import { useConfigureState } from '../../state/ConfigurationStateProvider';
import { ConfigureStateMappingIntegrationField } from '../../types';

import { setFieldMapping } from './setFieldMapping';

interface FieldMappingProps {
  field: ConfigureStateMappingIntegrationField,
  onSelectChange: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void,
  allFields: HydratedIntegrationFieldExistent[],
}

export function FieldMapping(
  { field, onSelectChange, allFields }: FieldMappingProps,
) {
  const { selectedObjectName } = useSelectedObjectName();
  const { setConfigureState } = useConfigureState();
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    // set default value if no value exists
    /* eslint no-underscore-dangle: ["error", { "allow": ["_default"] }] */
    if (!!field._default && !field.value) {
      if (selectedObjectName && !!field._default && !field.value) {
        setFieldMapping(selectedObjectName, setConfigureState, field.mapToName, field._default);
      }
    }
    setDisabled(false);
  }, [field, setConfigureState, selectedObjectName]);

  const options = useMemo(() => allFields?.map(
    (f) => <option key={f.fieldName} value={f.fieldName}>{f.displayName}</option>,
  ), [allFields]);

  return (
    <Stack key={field.mapToName}>
      <Text fontWeight="500">{field.mapToDisplayName}</Text>
      <Text marginBottom="5px" fontSize={14}>{field?.prompt}</Text>
      <Select
        name={field.mapToName}
        variant="flushed"
        value={field.value}
        onChange={onSelectChange}
        placeholder={!field.value ? 'Please select one' : undefined} // remove placeholder when value is selected
        disabled={disabled}
      >
        {options}
      </Select>
    </Stack>
  );
}
