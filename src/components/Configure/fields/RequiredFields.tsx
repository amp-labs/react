import { Box, Tag } from '@chakra-ui/react';

import { useProject } from '../../../context/ProjectContext';
import { useSelectedObjectName } from '../ObjectManagementNav';
import { useConfigureState } from '../state/ConfigurationStateProvider';
import { getConfigureState } from '../state/utils';
import { isIntegrationFieldMapping } from '../utils';

import { FieldHeader } from './FieldHeader';

export function RequiredFields() {
  const { selectedObjectName } = useSelectedObjectName();
  const { objectConfigurationsState } = useConfigureState();
  const configureState = getConfigureState(selectedObjectName || '', objectConfigurationsState);
  const { appName } = useProject();

  return (
    <>
      <FieldHeader string={`${appName} reads the following ${selectedObjectName} fields`} />
      <Box marginBottom="20px">
        {configureState?.requiredFields?.length
          ? (configureState?.requiredFields?.map((field) => {
            if (!isIntegrationFieldMapping(field)) {
              return <Tag key={field.fieldName}>{field.displayName}</Tag>;
            }
            return null; // fallback for customed mapped fields
          }))
          : 'There are no required fields.'}
      </Box>
    </>
  );
}
