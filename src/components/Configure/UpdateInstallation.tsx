import { useCallback, useContext, useEffect } from 'react';

import { ApiKeyContext } from '../../context/ApiKeyContext';
import { useHydratedRevision } from '../../context/HydratedRevisionContext';
import { useProject } from '../../context/ProjectContext';
import { Installation, Integration } from '../../services/api';

import { onSaveUpdate } from './actions/onSaveUpdate';
import { useConfigureState } from './state/ConfigurationStateProvider';
import { resetConfigurationState } from './state/utils';
import { ConfigureInstallationBase } from './ConfigureInstallationBase';
import { content } from './content';
import { useSelectedObjectName } from './ObjectManagementNav';
import { PLACEHOLDER_VARS } from './utils';

interface UpdateInstallationProps {
  installation: Installation,
  integrationObj: Integration,
}

//  Update Installation Flow
export function UpdateInstallation(
  { installation, integrationObj }: UpdateInstallationProps,
) {
  const { hydratedRevision, loading } = useHydratedRevision();
  const { selectedObjectName } = useSelectedObjectName();
  const apiKey = useContext(ApiKeyContext);
  const { project, projectId } = useProject();
  const appName = project?.appName || '';

  // when no installation or config exists, render create flow
  const { config } = installation;

  // 1. get config from installations (contains form selection state)
  // 2. get the hydrated revision (contains full form)
  // 3. generate the configuration state from the hydrated revision and config
  const { configureState, setConfigureState } = useConfigureState();

  const resetState = useCallback(() => {
    if (hydratedRevision?.content?.actions && !loading && selectedObjectName) {
      resetConfigurationState(hydratedRevision, config, selectedObjectName, setConfigureState);
    }
  }, [hydratedRevision, loading, selectedObjectName, config, setConfigureState]);

  useEffect(() => {
    // set configurationState when hydratedRevision is loaded
    resetState();
  }, [resetState]);

  const onSave = () => {
    if (installation && selectedObjectName) {
      onSaveUpdate(
        projectId,
        configureState,
        config,
        selectedObjectName,
        installation.id,
        integrationObj.id,
        apiKey,
      );
    } else {
      // TODO: create new installation
      console.error('no installation or selectedObjectName');
    }
  };

  const title = content.reconfigureIntro(
    appName,
    integrationObj.provider,
    PLACEHOLDER_VARS.PROVIDER_WORKSPACE_REF,
  );

  return (
    <ConfigureInstallationBase
      onSave={onSave}
      onCancel={resetState}
      title={title}
    />
  );
}
