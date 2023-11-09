import { useEffect, useMemo, useState } from 'react';
import {
  Select, Stack, Text,
} from '@chakra-ui/react';

import { HydratedIntegrationFieldExistent, IntegrationFieldMapping } from '../../../../services/api';
import { useSelectedObjectName } from '../../ObjectManagementNav';
import { useConfigureState } from '../../state/ConfigurationStateProvider';
import { getConfigureState } from '../../state/utils';

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
  const { selectedObjectName } = useSelectedObjectName();
  const { objectConfigurationsState, setConfigureState } = useConfigureState();
  const [disabled, setDisabled] = useState(true);
  const configureState = getConfigureState(selectedObjectName || '', objectConfigurationsState);
  const { selectedFieldMappings: selectedRequiredMapFields } = configureState || {};
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

  return (
    <Stack key={field.mapToName}>
      <Text fontWeight="500">{field.mapToDisplayName}</Text>
      <Text marginBottom="5px" fontSize={14}>{field?.prompt}</Text>
      <Select
        name={field.mapToName}
        variant="flushed"
        value={fieldValue || undefined}
        onChange={onSelectChange}
        placeholder={!fieldValue ? 'Please select one' : undefined} // remove placeholder when value is selected
        disabled={disabled}
      >
        {options}
      </Select>
    </Stack>
  );
}
