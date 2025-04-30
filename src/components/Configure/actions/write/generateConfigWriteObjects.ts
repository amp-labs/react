import { ConfigureState } from "../../types";

/**
 * example type
 * "objects":
 *  {
    objects: {
      account: {
        objectName: 'account',
        selectedValueDefaults: {
          first: 'Joe',
          lastName: 'Default',
        },
      },
      contact: {
        objectName: 'contact',
      },
    },
  }
 * @param writeObjects
 * @param configureState
 * @returns
 */
export const generateConfigWriteObjects = (configureState: ConfigureState) => ({
  ...configureState.write?.selectedWriteObjects,
});
