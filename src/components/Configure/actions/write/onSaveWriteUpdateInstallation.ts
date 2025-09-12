import {
  HydratedRevision,
  UpdateInstallationRequestInstallationConfig,
} from "services/api";

import { ConfigureState } from "../../types";
import { getIsProxyEnabled } from "../proxy/isProxyEnabled";

import { generateConfigWriteObjects } from "./generateConfigWriteObjects";

/**
 * given a configureState generate the config object that is need for
 * update installation request.
 *
 * @param configureState
 * @returns
 */
export const generateUpdateWriteConfigFromConfigureState = (
  configureState: ConfigureState,
  hydratedRevision: HydratedRevision,
): UpdateInstallationRequestInstallationConfig => {
  const configWriteObjects = generateConfigWriteObjects(configureState);

  // config request object type needs to be fixed
  const updateConfigObject: UpdateInstallationRequestInstallationConfig = {
    content: {
      write: {
        objects: configWriteObjects,
      },
    },
  };

  // insert proxy into config if it is enabled
  const isProxyEnabled = getIsProxyEnabled(hydratedRevision);
  if (isProxyEnabled) {
    if (!updateConfigObject.content) updateConfigObject.content = {};
    updateConfigObject.content.proxy = { enabled: true };
  }

  return updateConfigObject;
};
