import { Draft } from 'immer';

import { isFieldObjectEqual } from '../../../state/utils';
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

    // check is modified
    if (draft?.write?.savedConfig?.selectedNonConfigurableWriteFields) {
      const savedFields = draft.write.savedConfig.selectedNonConfigurableWriteFields;
      const updatedFields = draftSelectedWriteFields;
      const isModified = !isFieldObjectEqual(savedFields, updatedFields);
      // immer syntax to set a value
      // eslint-disable-next-line no-param-reassign
      draft.write.isWriteModified = isModified;
    }
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
