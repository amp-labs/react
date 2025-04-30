// import { FieldDefaultValueMapping } from '../FieldDefaultValueMapping/FieldDefaultValueMapping';

import { WriteFieldsV2 } from "./WriteFieldsV2";

/**
 * Bridge component to WriteFieldsV2
 * @returns
 */
export function WriteFields() {
  return (
    <>
      <WriteFieldsV2 />
      {/* TODO(ENG-1970): Bring this back when new valueDefault format is supported */}
      {/* <FieldDefaultValueMapping /> */}
    </>
  );
}
