import { useEffect, useState } from 'react';
import {
  Select, Stack, Text,
} from '@chakra-ui/react';

import { HydratedIntegrationFieldExistent } from '../../../services/api';
import { useConfigureState } from '../state/ConfigurationStateProvider';
import { setRequiredCustomMapFieldValue } from '../state/utils';
import { CustomConfigureStateIntegrationField } from '../types';

export function RequiredFieldsSelect(
  { field, onSelectChange, allFields }: {
    field: CustomConfigureStateIntegrationField,
    onSelectChange: (
      e: React.ChangeEvent<HTMLSelectElement>
    ) => void,
    allFields: HydratedIntegrationFieldExistent[]
  },
) {
  const { configureState, setConfigureState } = useConfigureState();
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    /* eslint no-underscore-dangle: ["error", { "allow": ["_default"] }] */
    if (!!field._default && !field.value) {
      setRequiredCustomMapFieldValue(
        field.mapToName,
        field._default, /* eslint no-underscore-dangle: ["error", { "allow": ["_default"] }] */
        configureState,
        setConfigureState,
      );
    }
    setDisabled(false);
  }, [field, allFields, configureState, setConfigureState]);

  const options = allFields?.map(
    (f) => <option key={f.fieldName} value={f.fieldName}>{f.displayName}</option>,
  );
  return (
    <Stack key={field.mapToName}>
      <Text fontWeight="500">{field.mapToDisplayName}</Text>
      <Text marginBottom="5px" fontSize={14}>{field?.prompt}</Text>
      <Select
        name={field.mapToName}
        variant="flushed"
        value={field.value}
        onChange={onSelectChange}
        placeholder="Please select one"
        disabled={disabled}
      >
        {options}
      </Select>
    </Stack>
  );
}
