import {
  Select, Stack, Text,
} from '@chakra-ui/react';

import { content } from '../content';
import { useSelectedObjectName } from '../ObjectManagementNav';
import { ConfigureState } from '../types';
import { isIntegrationFieldMapping } from '../utils';

type RequiredCustomFieldsProps = {
  configureState: ConfigureState;
  setConfigureState: (configureState: ConfigureState) => void;
};

export function RequiredCustomFields(
  { configureState, setConfigureState }: RequiredCustomFieldsProps,
) {
  const { selectedObjectName } = useSelectedObjectName();
  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    const { requiredCustomMapFields } = configureState;
    const requiredCustomMapFieldtoUpdate = requiredCustomMapFields?.find(
      (field) => field.mapToName === name,
    );

    if (requiredCustomMapFieldtoUpdate) {
      // Update the custome field value property to new value
      requiredCustomMapFieldtoUpdate.value = value;
      const newState = {
        ...configureState,
        requiredCustomMapFields: [...requiredCustomMapFields || []],
      };

      // update state
      setConfigureState(newState);
    }
  };
  return (
    <Stack>
      {configureState.requiredCustomMapFields?.map((field) => {
        if (isIntegrationFieldMapping(field)) {
          return (
            <Stack key={field.mapToName}>
              <Text marginBottom="5px">
                {content.customMappingText(selectedObjectName || '', field.mapToName)}
              </Text>
              <Select
                name={field.mapToName}
                variant="flushed"
                value={field.value}
                onChange={onSelectChange}
                placeholder="Please select one"
              >
                {configureState?.allFields?.map((f) => (
                  <option key={f.fieldName} value={f.fieldName}>{f.displayName}</option>
                ))}
              </Select>
            </Stack>
          );
        }
        return null; // fallback for existant fields
      })}
    </Stack>
  );
}
