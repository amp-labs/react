import { Draft } from "immer";

import { ConfigureState } from "../../../types";

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


    // DEBUG: print out the draft
    // console.debug(JSON.stringify(draft, null, 2));
  }
}

export function setNonConfigurableWriteField(
  selectedObjectName: string,
  setConfigureState: (
    objectName: string,
    producer: (draft: Draft<ConfigureState>) => void,
  ) => void,
  fieldKey: string,
  checked: boolean,
) {
  setConfigureState(selectedObjectName, (draft) => {
    setNonConfigurableWriteFieldProducer(draft, fieldKey, checked);
  });
}
