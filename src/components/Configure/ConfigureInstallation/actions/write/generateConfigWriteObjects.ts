import { ConfigureState } from '../../../types';

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
  const selected = configureState.write?.selectedNonConfigurableWriteFields;
  const selectedKeys = selected ? Object.keys(selected) : [];

  if (configStateWriteObjects) {
    configStateWriteObjects.forEach((configStateWriteObject) => {
      const obj = configStateWriteObject.objectName;
      // object exists in config form
      if (selectedKeys.includes(obj)) {
        // insert objectName into configWriteObjects
        configWriteObjects[obj] = {
          objectName: obj,
        };
      }
    });
  }
  return configWriteObjects;
};
