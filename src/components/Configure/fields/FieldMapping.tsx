import { useEffect, useMemo, useState } from 'react';
import {
  Select, Stack, Text,
} from '@chakra-ui/react';

import { HydratedIntegrationFieldExistent } from '../../../services/api';
import { useConfigureState } from '../state/ConfigurationStateProvider';
import { setRequiredCustomMapFieldValue } from '../state/utils';
import { ConfigureStateMappingIntegrationField } from '../types';

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
  const { configureState, setConfigureState } = useConfigureState();
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    /* eslint no-underscore-dangle: ["error", { "allow": ["_default"] }] */
    if (!!field._default && !field.value) {
      const { isUpdated, newState } = setRequiredCustomMapFieldValue(
        field.mapToName,
        field._default, /* eslint no-underscore-dangle: ["error", { "allow": ["_default"] }] */
        configureState,
      );

      if (isUpdated) {
        setConfigureState(newState);
      }
    }
    setDisabled(false);
  }, [field, allFields, configureState, setConfigureState]);

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
