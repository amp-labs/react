import { Box, Tag, Text } from '@chakra-ui/react';

import { useProject } from '../../../context/ProjectContext';
import { content } from '../content';
import { useSelectedObjectName } from '../ObjectManagementNav';
import { useConfigureState } from '../state/ConfigurationStateProvider';
import { isIntegrationFieldMapping } from '../utils';

export function RequiredFields() {
  const { configureState } = useConfigureState();
  const { selectedObjectName } = useSelectedObjectName();
  const { project } = useProject();
  const appName = project?.appName || '';
  return (
    <>
      <Text marginBottom="5px">
        {content.reconfigureRequiredFields(appName, selectedObjectName || '')}
      </Text>
      <Box marginBottom="20px">
        {configureState.requiredFields?.map((field) => {
          if (!isIntegrationFieldMapping(field)) {
            return <Tag key={field.fieldName}>{field.displayName}</Tag>;
          }
          return null; // fallback for customed mapped fields
        })}
      </Box>
    </>
  );
}
