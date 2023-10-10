/**
 * this page is wip: untested
 */
import { useCallback, useContext, useEffect } from 'react';

import { ApiKeyContext } from '../../context/ApiKeyContext';
import { useConnections } from '../../context/ConnectionsContext';
import { useHydratedRevision } from '../../context/HydratedRevisionContext';
import { useInstallIntegrationProps } from '../../context/InstallIntegrationContext';
import { useProject } from '../../context/ProjectContext';
import { api, CreateInstallationOperationRequest } from '../../services/api';

import { useConfigureState } from './state/ConfigurationStateProvider';
import { resetConfigurationState } from './state/utils';
import { ConfigureInstallationBase } from './ConfigureInstallationBase';
import { useSelectedObjectName } from './ObjectManagementNav';

// the config should be undefined for create flow
const UNDEFINED_CONFIG = undefined;

//  Create Installation Flow
export function CreateInstallation() {
  const { integrationId, groupRef, consumerRef } = useInstallIntegrationProps();
  const { hydratedRevision, loading } = useHydratedRevision();
  const { selectedObjectName } = useSelectedObjectName();
  const { selectedConnection } = useConnections();
  const apiKey = useContext(ApiKeyContext);
  const { projectId } = useProject();

  // 1. get the hydrated revision
  // 3. generate the configuration state from the hydrated revision
  const { setConfigureState } = useConfigureState();

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
    // TODO: create new installation : wip
    console.log('on save create new installation', apiKey);
    const objectName = selectedObjectName || '';

    const createInstallationRequest: CreateInstallationOperationRequest = {
      projectId,
      integrationId,
      installation: {
        groupRef,
        connectionId: selectedConnection?.id ?? '',
        config: {
          revisionId: hydratedRevision?.id ?? '',
          createdBy: consumerRef,
          content: {
            api: hydratedRevision?.content?.api || '',
            read: {
              standardObjects: {
                [objectName]: {
                  objectName,
                  // todo form config for read from hydratedRevision and configuration state
                  schedule: '',
                  destination: '',
                },
              },
            },
          },
        },
      },
    };

    api().createInstallation(createInstallationRequest, {
      headers: {
        'X-Api-Key': apiKey ?? '',
      },
    })
      .then((installation) => {
        console.log('installation', installation);
      })
      .catch((err) => {
        console.error('ERROR: ', err);
      });
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
