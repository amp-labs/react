import { FieldDefaultValueMapping } from '../FieldDefaultValueMapping/FieldDefaultValueMapping';

import { WriteFieldsV2 } from './WriteFieldsV2';

const DEFAULT_VALUE_FF = false;

/**
 * Bridge component to WriteFieldsV2
 * @returns
 */
export function WriteFields() {
  return (
    <>
      <WriteFieldsV2 />
      {DEFAULT_VALUE_FF && <FieldDefaultValueMapping />}
    </>
  );
}
