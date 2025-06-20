import { DeleteObject } from "./DeleteObject";
import { OptionalFieldMappings, RequiredFieldMappings } from "./FieldMappings";
import { useClearOldFieldMappings } from "./FieldMappings/useClearOldFieldMappings";
import { ReadObjectMapping } from "./ObjectMapping";
import { OptionalFields } from "./OptionalFields";
import { RequiredFields } from "./RequiredFields";
import { ValueMappings } from "./ValueMapping";

const SHOW_DELETE_OBJECT = false;

export function ReadFields() {
  useClearOldFieldMappings();

  return (
    <>
      <ReadObjectMapping />
      <RequiredFields />
      <RequiredFieldMappings />
      <OptionalFieldMappings />
      <ValueMappings />
      <OptionalFields />
      {SHOW_DELETE_OBJECT && <DeleteObject />}
    </>
  );
}
