import { Draft } from 'immer';

import { ConfigureState } from '../../../types';

function setNonConfigurableWriteFieldProducer(
  draft: Draft<ConfigureState>,
  fieldKey: string,
  checked: boolean,
) {
  if (draft?.write?.selectedNonConfigurableWriteFields === null) {
    // immer syntax to set a value
    // eslint-disable-next-line no-param-reassign
    draft.write.selectedNonConfigurableWriteFields = {};
  }

  if (draft?.write) {
    const draftSelectedWriteFields = draft.write.selectedNonConfigurableWriteFields;
    draftSelectedWriteFields[fieldKey] = checked;

    if (!checked) {
      delete draftSelectedWriteFields[fieldKey];
    }

    // TODO: add isModified check
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
