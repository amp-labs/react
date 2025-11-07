import { UpdateInstallationRequestInstallationConfig } from "services/api";

import { ConfigureState } from "../../types";

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
): UpdateInstallationRequestInstallationConfig => ({
  content: {
    write: {
      objects: generateConfigWriteObjects(configureState),
    },
  },
});
