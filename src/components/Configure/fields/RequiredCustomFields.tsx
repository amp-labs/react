import { useMemo } from 'react';
import {
  Box, Stack,
} from '@chakra-ui/react';

import { useConfigureState } from '../state/ConfigurationStateProvider';
import { setRequiredCustomMapFieldValue } from '../state/utils';
import { isIntegrationFieldMapping } from '../utils';

import { FieldHeader } from './FieldHeader';
import { RequiredFieldsSelect } from './RequiredFieldsSelect';
import { CustomConfigureStateIntegrationField } from '../types'

interface RequiredCustomFieldsProps {
  formErrorFields: CustomConfigureStateIntegrationField[],
  setFormErrorFields: (fields: CustomConfigureStateIntegrationField[]) => void,
}

export function RequiredCustomFields(
  { formErrorFields, setFormErrorFields }: RequiredCustomFieldsProps,
) {
  const { configureState, setConfigureState } = useConfigureState();
  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    const { isUpdated, newState } = setRequiredCustomMapFieldValue(name, value, configureState);

    if (isUpdated) {
      setConfigureState(newState);
    }
    const newFormErrorFields = formErrorFields?.filter((field) => field.mapToName !== name)
    setFormErrorFields(newFormErrorFields)
    setRequiredCustomMapFieldValue(name, value, configureState);
  };

  const integrationFieldMappings = useMemo(
    () => configureState?.requiredCustomMapFields?.filter(
      isIntegrationFieldMapping,
    ) || [],
    [configureState],
  );


  return (
    <Box>
      <FieldHeader string="Map the following fields (required)" />
      <Stack>
        {integrationFieldMappings.map((field) => {
          // check if current select field is in error
          const isError = !!formErrorFields?.find((errorField) => errorField.mapToName === field.mapToName)

          return < RequiredFieldsSelect
            key={field.mapToName}
            allFields={configureState.allFields || []}
            field={field}
            onSelectChange={onSelectChange}
            isError={isError}
          />

        })}
      </Stack>
    </Box>

  );
}
