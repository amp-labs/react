import { Draft } from "immer";

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
