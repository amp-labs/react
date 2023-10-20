/**
 * this page is wip: untested
 */
import { useCallback, useContext, useEffect, useState } from 'react';

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
import { CustomConfigureStateIntegrationField } from './types';

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

  const [formErrorFields, setFormErrorFields] = useState<CustomConfigureStateIntegrationField[]>([]);


  const onSave = (e: any) => {
    e.preventDefault();
    setFormErrorFields([]);

    const { requiredCustomMapFields } = configureState;
    const fieldsWithRequirementsNotMet = requiredCustomMapFields?.filter((field) => !field.value)

    // if requires fields are not met, set error fields and return
    if (fieldsWithRequirementsNotMet?.length) {
      setFormErrorFields(fieldsWithRequirementsNotMet)
      console.error('required fields not met', fieldsWithRequirementsNotMet.map(field => field.mapToDisplayName))
      return;
    }

    // check configrueState for required fields
    if (selectedObjectName && selectedConnection?.id && apiKey && projectId
      && integrationId && groupRef && consumerRef && hydratedRevision) {
      onSaveCreate(
        projectId,
        integrationId,
        groupRef,
        consumerRef,
        selectedConnection.id,
        selectedObjectName,
        apiKey,
        hydratedRevision,
        configureState,
        setInstallation,
      );
    } else {
      console.error('OnSaveCreate: missing required props');
    }
  };

  return (
    <ConfigureInstallationBase
      onSave={onSave}
      onCancel={resetState}
      formErrorFields={formErrorFields}
      setFormErrorFields={setFormErrorFields}
    />
  );
}
