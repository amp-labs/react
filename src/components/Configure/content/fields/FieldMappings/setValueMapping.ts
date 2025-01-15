import { Draft, original } from 'immer';

import { ConfigureState } from '../../../types';

function setValueMappingProducer(
  draft: Draft<ConfigureState>,
  selectedObjectName:string,
  sourceValue: string,
  targetValue: string,
  fieldName: string,
) {
  const draftValueMappings = draft?.read?.selectedValueMappings || {};
  const draftValueMappingForObject = draftValueMappings[selectedObjectName] || {};
  draftValueMappingForObject[fieldName] = targetValue;

  // eslint-disable-next-line no-console
  console.log('DEBUG(3), changing value mapping', original(draft), sourceValue, targetValue, fieldName);
}

export function setValueMapping(
  selectedObjectName: string,
  setConfigureState: (objectName: string,
    producer: (draft: Draft<ConfigureState>) => void) => void,
  sourceValue: string,
  targetValue: string,
  fieldName: string,
) {
  setConfigureState(
    selectedObjectName,
    (draft) => setValueMappingProducer(draft, selectedObjectName, sourceValue, targetValue, fieldName),
  );
}
