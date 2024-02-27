import { useEffect, useState } from 'react';

import { LoadingIcon } from '../../../../assets/LoadingIcon';
import { useApiKey } from '../../../../context/ApiKeyContextProvider';
import { useConnections } from '../../../../context/ConnectionsContextProvider';
import { useInstallIntegrationProps } from '../../../../context/InstallIntegrationContextProvider';
import { useProject } from '../../../../context/ProjectContextProvider';
import { hasKeys } from '../../../../utils';
import { ErrorTextBox } from '../../../ErrorTextBox';
import { createInstallationProxyOnly } from '../../actions/proxy/createInstallationProxyOnly';
import { useHydratedRevision } from '../../state/HydratedRevisionContext';

import { nonProxyActionList } from './constants';
import { InstalledSuccessBox } from './InstalledSuccessBox';

function getDefinedKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj).filter(
    (key: keyof T) => obj[key] !== undefined,
  ) as (keyof T)[];
}

interface ConditionalProxyLayoutProps {
  children: React.ReactNode;
}

/**
 * if the hydratedRevision only has proxy actions,
 * then it will not render the ConfigureInstallation
 * @returns
 */
export function ConditionalProxyLayout({ children }: ConditionalProxyLayoutProps) {
  const { projectId } = useProject();
  const apiKey = useApiKey();
  const { hydratedRevision, loading: hydratedRevisionLoading } = useHydratedRevision();
  const {
    integrationObj, installation, groupRef, consumerRef, setInstallation,
  } = useInstallIntegrationProps();
  const { selectedConnection } = useConnections();
  const [createInstallLoading, setCreateInstallLoading] = useState(false);
  const isLoading = hydratedRevisionLoading || createInstallLoading;

  const provider = hydratedRevision?.content?.provider;

  const actionKeys = Object.keys(hydratedRevision?.content || {});

  const isProxyOnly: boolean = !hasKeys(actionKeys, nonProxyActionList);

  useEffect(() => {
    if (hydratedRevision && isProxyOnly && !installation && selectedConnection && apiKey && integrationObj?.id) {
      setCreateInstallLoading(true);
      createInstallationProxyOnly({
        apiKey,
        projectId,
        integrationId: integrationObj?.id,
        groupRef,
        consumerRef,
        connectionId: selectedConnection?.id,
        hydratedRevision,
        setInstallation,
      }).then(() => {
        setCreateInstallLoading(false);
      }).catch((e) => {
        setCreateInstallLoading(false);
        console.error('Error when creating proxy installation:', e);
      });
    }
  }, [hydratedRevision, isProxyOnly, installation,
    selectedConnection, apiKey, projectId, integrationObj?.id, groupRef, consumerRef, setInstallation]);

  if (!integrationObj) return <ErrorTextBox message={"We can't load the integration"} />;
  if (isLoading) return <LoadingIcon />;
  if (isProxyOnly && provider && installation) return <InstalledSuccessBox provider={provider} />;

  return (
    <div>
      {children}
    </div>
  );
}
