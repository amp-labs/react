// import { FieldDefaultValueMapping } from '../FieldDefaultValueMapping/FieldDefaultValueMapping';

import { WriteObjectsV2 } from "./WriteObjectsV2";

/**
 * Bridge component to WriteObjectsV2
 * @returns
 */
export function WriteObjects() {
  return (
    <>
      <WriteObjectsV2 />
      {/* TODO(ENG-1970): Bring this back when new valueDefault format is supported */}
      {/* <FieldDefaultValueMapping /> */}
    </>
  );
}
