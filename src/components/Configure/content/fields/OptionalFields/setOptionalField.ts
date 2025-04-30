import { Draft } from "immer";

import { isFieldObjectEqual } from "../../../state/utils";
import { ConfigureState } from "../../../types";

function setOptionalFieldProducer(
  draft: Draft<ConfigureState>,
  fieldKey: string,
  checked: boolean,
) {
  const draftSelectedOptionalFields = draft?.read?.selectedOptionalFields || {};
  draftSelectedOptionalFields[fieldKey] = checked;
  if (!checked) {
    delete draftSelectedOptionalFields[fieldKey];
  }

  if (draft.read?.savedConfig.optionalFields) {
    const savedFields = draft.read.savedConfig.optionalFields;
    const updatedFields = draftSelectedOptionalFields;
    const isModified = !isFieldObjectEqual(savedFields, updatedFields);
    // immer exception if we try to set a value

    draft.read.isOptionalFieldsModified = isModified;
  } else {
    console.warn("read.savedConfig.optionalFields is undefined");
  }
}

export function setOptionalField(
  selectedObjectName: string,
  setConfigureState: (
    objectName: string,
    producer: (draft: Draft<ConfigureState>) => void,
  ) => void,
  fieldKey: string,
  checked: boolean,
) {
  setConfigureState(selectedObjectName, (draft) =>
    setOptionalFieldProducer(draft, fieldKey, checked),
  );
}
