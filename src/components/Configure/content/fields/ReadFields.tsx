import { DisableReadObject } from "./DisableReadObject";
import { OptionalFieldMappings, RequiredFieldMappings } from "./FieldMappings";
import { useClearOldFieldMappings } from "./FieldMappings/useClearOldFieldMappings";
import { ReadObjectMapping } from "./ObjectMapping";
import { OptionalFields } from "./OptionalFields";
import { ReenableObject } from "./ReenableObject";
import { RequiredFields } from "./RequiredFields";
import { ValueMappings } from "./ValueMapping";

const SHOW_DISABLE_READ_OBJECT = false;

export function ReadFields() {
  useClearOldFieldMappings();

  return (
    <>
      {SHOW_DISABLE_READ_OBJECT && <ReenableObject />}
      <ReadObjectMapping />
      <RequiredFields />
      <RequiredFieldMappings />
      <OptionalFieldMappings />
      <ValueMappings />
      <OptionalFields />
      {SHOW_DISABLE_READ_OBJECT && <DisableReadObject />}
    </>
  );
}
