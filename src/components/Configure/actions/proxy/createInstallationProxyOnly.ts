import {
  CreateInstallationRequestConfig,
  HydratedRevision,
} from '../../../../services/api';
import { createInstallationReducer, CreateInstallationSharedProps } from '../../reducers/createInstallationReducer';

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

export function createInstallationProxyOnly({
  projectId,
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

  return createInstallationReducer({
    createConfig,
    projectId,
    integrationId,
    groupRef,
    connectionId,
    apiKey,
    setInstallation,
    onInstallSuccess,
  });
}
