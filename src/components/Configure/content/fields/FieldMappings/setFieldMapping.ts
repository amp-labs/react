import { Draft } from "immer";

import { ConfigureState } from "../../../types";

export type MappingFields = {
  field: string;
  value: string | null;
};

function setFieldMappingProducer(
  draft: Draft<ConfigureState>,
  fields: Array<MappingFields>,
) {
  const draftRequiredMapFields = draft?.read?.selectedFieldMappings || {};

  fields.forEach((mapping) => {
    const { field, value } = mapping;
    if (value === null) {
      delete draftRequiredMapFields[field];
    } else {
      draftRequiredMapFields[field] = value;
    }
  });

  // Note: isModified is now derived state, no longer stored in local state
}

export function setFieldMapping(
  selectedObjectName: string,
  setConfigureState: (
    objectName: string,
    producer: (draft: Draft<ConfigureState>) => void,
  ) => void,
  fields: Array<MappingFields>,
) {
  setConfigureState(selectedObjectName, (draft) =>
    setFieldMappingProducer(draft, fields),
  );
}
