import { Box, Checkbox, Stack } from '@chakra-ui/react';
import { Draft } from 'immer';

import { useProject } from '../../../context/ProjectContext';
import { useSelectedObjectName } from '../ObjectManagementNav';
import { useConfigureState } from '../state/ConfigurationStateProvider';
import { checkFieldsEquality, getConfigureState } from '../state/utils';
import { ConfigureState } from '../types';
import { isIntegrationFieldMapping } from '../utils';

import { FieldHeader } from './FieldHeader';

function setOptionalField(
  selectedObjectName: string,
  setConfigureState: (objectName: string,
    producer: (draft: Draft<ConfigureState>) => void) => void,
  fieldKey: string,
  checked: boolean,
) {
  setConfigureState(selectedObjectName, (currentConfigureStateDraft: Draft<ConfigureState>) => {
    const draftSelectedOptionalFields = currentConfigureStateDraft?.selectedOptionalFields || {};
    draftSelectedOptionalFields[fieldKey] = checked;

    // Compare saved fields from updated fields
    const savedOptionalFields = currentConfigureStateDraft.savedConfig?.optionalFields;

    // Check if the optionalFields are modified
    const isModified = !checkFieldsEquality(savedOptionalFields, draftSelectedOptionalFields);

    // immer exception if we try to set a value
    // eslint-disable-next-line no-param-reassign
    currentConfigureStateDraft.isRequiredMapFieldsModified = isModified;
  });
}

export function OptionalFields() {
  const { appName } = useProject();
  const { objectConfigurationsState, setConfigureState } = useConfigureState();
  const { selectedObjectName } = useSelectedObjectName();
  const configureState = getConfigureState(selectedObjectName || '', objectConfigurationsState);
  const { selectedOptionalFields } = configureState || {};

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    if (selectedObjectName && configureState) {
      setOptionalField(selectedObjectName, setConfigureState, name, checked);
    }
  };

  const shouldRender = !!(configureState?.optionalFields && configureState?.optionalFields);
  return (
    shouldRender && (
      <>
        <FieldHeader string={`${appName} reads the following optional fields`} />
        <Stack
          marginBottom={10}
          height={300}
          overflowY="scroll"
          border="2px solid #EFEFEF"
          borderRadius={8}
          padding={4}
        >
          {configureState?.optionalFields?.map((field) => {
            if (!isIntegrationFieldMapping(field)) {
              return (
                <Box key={field.fieldName} display="flex" gap="5px" borderBottom="1px" borderColor="gray.100">
                  <Checkbox
                    name={field.fieldName}
                    id={field.fieldName}
                    isChecked={!!selectedOptionalFields?.[field?.fieldName]}
                    onChange={onCheckboxChange}
                  >
                    {field.displayName}
                  </Checkbox>
                </Box>
              );
            }
            return null; // fallback for customed mapped fields
          })}
        </Stack>
      </>
    )
  );
}
