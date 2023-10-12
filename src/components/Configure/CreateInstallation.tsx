/**
 * this page is wip: untested
 */
import { useCallback, useContext, useEffect } from 'react';

import { ApiKeyContext } from '../../context/ApiKeyContext';
import { useConnections } from '../../context/ConnectionsContext';
import { useHydratedRevision } from '../../context/HydratedRevisionContext';
import { useInstallIntegrationProps } from '../../context/InstallIntegrationContext';
import { useProject } from '../../context/ProjectContext';

import { onSaveCreate } from './actions/onSaveCreate';
import { useConfigureState } from './state/ConfigurationStateProvider';
import { resetConfigurationState } from './state/utils';
import { ConfigureInstallationBase } from './ConfigureInstallationBase';
import { useSelectedObjectName } from './ObjectManagementNav';

// the config should be undefined for create flow
const UNDEFINED_CONFIG = undefined;

//  Create Installation Flow
export function CreateInstallation() {
  const {
    integrationId, groupRef, consumerRef, setInstallation,
  } = useInstallIntegrationProps();
  const { hydratedRevision, loading } = useHydratedRevision();
  const { selectedObjectName } = useSelectedObjectName();
  const { selectedConnection } = useConnections();
  const apiKey = useContext(ApiKeyContext);
  const { projectId } = useProject();

  // 1. get the hydrated revision
  // 3. generate the configuration state from the hydrated revision
  const { configureState, setConfigureState } = useConfigureState();

  const resetState = useCallback(() => {
    if (hydratedRevision?.content?.actions && !loading && selectedObjectName) {
      resetConfigurationState(
        hydratedRevision,
        UNDEFINED_CONFIG,
        selectedObjectName,
        setConfigureState,
      );
    }
  }, [hydratedRevision, loading, selectedObjectName, setConfigureState]);

  useEffect(() => {
    // set configurationState when hydratedRevision is loaded
    resetState();
  }, [resetState]);

  const onSave = () => {
    if (selectedObjectName && selectedConnection?.id && apiKey && projectId
         && integrationId && groupRef && consumerRef && hydratedRevision) {
      onSaveCreate(
        selectedObjectName,
        projectId,
        integrationId,
        groupRef,
        consumerRef,
        selectedConnection.id,
        apiKey,
        hydratedRevision,
        configureState,
        setInstallation,
      );
    } else {
      console.error('OnSaveCreate: missing required props');
    }
  };

  const title = <>Create a new installation</>;

  return (
    <ConfigureInstallationBase
      onSave={onSave}
      onCancel={resetState}
      title={title}
    />
  );
}
