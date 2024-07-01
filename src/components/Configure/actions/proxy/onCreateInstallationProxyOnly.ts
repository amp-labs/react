import {
  CreateInstallationRequestConfig,
  HydratedRevision,
} from '../../../../services/api';
import {
  createInstallationAndSetState,
  CreateInstallationSharedProps,
} from '../mutateAndSetState/createInstallationAndSetState';

/**
 * given a hydratedRevision and consumerRef,
 * generate the config object that is need for create installation request with proxy only.
 *
 * @param hydratedRevision
 * @param consumerRef
 *  @returns
 */
const generateProxyOnlyConfig = (
  hydratedRevision: HydratedRevision,
  consumerRef: string,
): (CreateInstallationRequestConfig | null) => {
  // create config request object
  const createConfigObj: CreateInstallationRequestConfig = {
    revisionId: hydratedRevision.id,
    createdBy: `consumer:${consumerRef}`,
    content: {
      provider: hydratedRevision.content.provider,
      proxy: {
        enabled: true,
      },
    },
  };

  return createConfigObj;
};

type CreateInstallationProxyOnlyProps = CreateInstallationSharedProps & {
  hydratedRevision: HydratedRevision;
  consumerRef: string;
} ;

export function onCreateInstallationProxyOnly({
  projectIdOrName,
  integrationId,
  groupRef,
  consumerRef,
  connectionId,
  apiKey,
  hydratedRevision,
  setInstallation,
  onInstallSuccess,
}: CreateInstallationProxyOnlyProps) {
  const createConfig = generateProxyOnlyConfig(
    hydratedRevision,
    consumerRef,
  );
  if (!createConfig) {
    console.error('Error when generating createConfig from configureState');
    return Promise.resolve(null);
  }

  return createInstallationAndSetState({
    createConfig,
    projectIdOrName,
    integrationId,
    groupRef,
    connectionId,
    apiKey,
    setInstallation,
    onInstallSuccess,
  });
}
