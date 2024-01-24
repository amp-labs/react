import { ConfigureState } from '../../types';

type WriteObject = {
  objectName: string;
};
type WriteObjects = {
  [objectName: string]: WriteObject;
};
/**
 * example type
 * "objects":
 *  {
    objects: {
      account: {
        objectName: 'account',
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
export const generateConfigWriteObjects = (configureState: ConfigureState) => {
  const configWriteObjects: WriteObjects = {}; // `any` is listed type in generated SDK
  const configStateWriteObjects = configureState.write?.writeObjects;
  if (configStateWriteObjects) {
    configStateWriteObjects.forEach((configStateWriteObject) => {
      const obj = configStateWriteObject.objectName;
      // object exists in config form
      if (obj) {
        // insert objectName into configWriteObjects
        configWriteObjects[obj] = {
          objectName: obj,
        };
      }
    });
  }
  return configWriteObjects;
};
