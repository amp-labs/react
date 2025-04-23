import { Draft } from 'immer';

import { areWriteObjectsEqual } from '../../../state/utils';
import { ConfigureState } from '../../../types';

function setNonConfigurableWriteFieldProducer(
  draft: Draft<ConfigureState>,
  fieldKey: string,
  checked: boolean,
) {
  if (draft?.write?.selectedWriteObjects === null) {
    // immer syntax to set a value
     
    draft.write.selectedWriteObjects = {};
  }

  if (draft?.write) {
    const draftSelectedWriteFields = draft.write.selectedWriteObjects;
    if (checked) {
      draftSelectedWriteFields[fieldKey] = { objectName: fieldKey };
    }

    if (!checked) {
      delete draftSelectedWriteFields[fieldKey];
    }

    // check is modified
    if (draft?.write?.savedConfig?.selectedWriteObjects) {
      const savedWriteObjects = draft.write.savedConfig.selectedWriteObjects;
      const updatedWriteObjects = draftSelectedWriteFields;
      const isModified = !areWriteObjectsEqual(savedWriteObjects, updatedWriteObjects);
      // immer syntax to set a value
       
      draft.write.isWriteModified = isModified;
    }

    // DEBUG: print out the draft
    // console.debug(JSON.stringify(draft, null, 2));
  }
}

export function setNonConfigurableWriteField(
  selectedObjectName: string,
  setConfigureState: (objectName: string,
    producer: (draft: Draft<ConfigureState>) => void) => void,
  fieldKey: string,
  checked: boolean,
) {
  setConfigureState(
    selectedObjectName,
    (draft) => { setNonConfigurableWriteFieldProducer(draft, fieldKey, checked); },
  );
}
