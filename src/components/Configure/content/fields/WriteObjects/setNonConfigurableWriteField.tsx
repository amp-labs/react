import { Draft } from "immer";

import { ConfigureState } from "../../../types";

function setNonConfigurableWriteObjectProducer(
  draft: Draft<ConfigureState>,
  objectKey: string,
  checked: boolean,
) {
  if (draft?.write?.selectedWriteObjects === null) {
    // immer syntax to set a value

    draft.write.selectedWriteObjects = {};
  }

  if (draft?.write) {
    const draftSelectedWriteObjects = draft.write.selectedWriteObjects;
    if (checked) {
      draftSelectedWriteObjects[objectKey] = { objectName: objectKey };
    }

    if (!checked) {
      delete draftSelectedWriteObjects[objectKey];
    }

    // DEBUG: print out the draft
    // console.debug(JSON.stringify(draft, null, 2));
  }
}

export function setNonConfigurableWriteObject(
  selectedObjectName: string,
  setConfigureState: (
    objectName: string,
    producer: (draft: Draft<ConfigureState>) => void,
  ) => void,
  objectKey: string,
  checked: boolean,
) {
  setConfigureState(selectedObjectName, (draft) => {
    setNonConfigurableWriteObjectProducer(draft, objectKey, checked);
  });
}
