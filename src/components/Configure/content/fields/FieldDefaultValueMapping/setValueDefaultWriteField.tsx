import { Draft } from 'immer';

import { areWriteObjectsEqual } from '../../../state/utils';
import { ConfigureState } from '../../../types';

function setValueDefaultWriteFieldProducer(
  draft: Draft<ConfigureState>,
  objectName: string, // object that the field belongs to
  fieldKey: string,
  defaultValue: string | null,
) {
  if (draft?.write?.selectedWriteObjects === null) {
    // eslint-disable-next-line no-param-reassign
    draft.write.selectedWriteObjects = {};
  }

  if (draft?.write) {
    const draftSelectedWriteFields = draft.write.selectedWriteObjects;
    if (defaultValue) {
      if (!draftSelectedWriteFields[objectName]) {
        // type change requires objectName to be set
        draftSelectedWriteFields[objectName] = { objectName };
      }

      if (!draftSelectedWriteFields[objectName].selectedValueDefaults) {
        draftSelectedWriteFields[objectName].selectedValueDefaults = {};
      }

      // eslint-disable-next-line no-param-reassign
      draftSelectedWriteFields[objectName].selectedValueDefaults[fieldKey].value = defaultValue;
    }

    if (!defaultValue) {
      if (draftSelectedWriteFields[objectName]?.selectedValueDefaults) {
        // delete the field key if the default value is null / empty
        delete draftSelectedWriteFields[objectName].selectedValueDefaults[fieldKey];
      }
    }

    // check is modified
    if (draft?.write?.savedConfig?.selectedWriteObjects) {
      const savedWriteObjects = draft.write.savedConfig.selectedWriteObjects;
      const updatedWriteObjects = draftSelectedWriteFields;
      const isModified = !areWriteObjectsEqual(savedWriteObjects, updatedWriteObjects);
      // immer syntax to set a value
      // eslint-disable-next-line no-param-reassign
      draft.write.isWriteModified = isModified;
    }

    // DEBUG: print out the draft
    // console.debug('Set default value', JSON.stringify(draft?.write, null, 2));
  }
}

export function setValueDefaultWriteField(
  // Note: this needs to be the selected tab object name, which is the "WRITE" tab object name
  selectedObjectName: string, // "WRITE" object for write tab.
  // Note: this is the object name of the object that the field belongs to
  objectName: string,
  fieldKey: string,
  defaultValue: string | null,
  setConfigureState: (objectName: string,
    producer: (draft: Draft<ConfigureState>) => void) => void,
) {
  setConfigureState(
    selectedObjectName, // "WRITE" object, for write tab
    (draft) => {
      setValueDefaultWriteFieldProducer(draft, objectName, fieldKey, defaultValue);
    },
  );
}
