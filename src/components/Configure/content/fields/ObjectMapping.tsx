import { FormCalloutBox } from 'src/components/FormCalloutBox';
import { useInstallIntegrationProps } from 'src/context/InstallIntegrationContextProvider';
import { useProject } from 'src/context/ProjectContextProvider';
import { capitalize, getProviderName } from 'src/utils';

import { useHydratedRevision } from '../../state/HydratedRevisionContext';
import { useSelectedConfigureState } from '../useSelectedConfigureState';

/**
 * ObjectMappingCallout component displays a callout box with the mapping information
 * @returns
 */
export function ReadObjectMapping() {
  const { project } = useProject();
  const { hydratedRevision } = useHydratedRevision();
  const { selectedObjectName } = useSelectedConfigureState();
  const { provider } = useInstallIntegrationProps();

  const appName = project?.appName;
  const providerName = getProviderName(provider);

  const selectedReadObject = hydratedRevision?.content?.read?.objects?.find(
    (obj) => obj.objectName === selectedObjectName,
  );

  const objectDisplayName = selectedReadObject?.displayName
  || (selectedObjectName && capitalize(selectedObjectName));

  const mapToName = selectedReadObject?.mapToName;
  const mapToDisplayName = selectedReadObject?.mapToDisplayName || (mapToName && capitalize(mapToName));

  if (mapToDisplayName && appName && providerName) {
    return (
      <FormCalloutBox style={{ marginTop: '1rem' }}>
        <p style={{ margin: '1rem 0' }}>
          <b>{mapToDisplayName}</b> in {appName} is mapped to <b>{objectDisplayName}</b> in {providerName}.
        </p>
      </FormCalloutBox>
    );
  }

  // renders no callout if there is no mapping
  return null;
}
