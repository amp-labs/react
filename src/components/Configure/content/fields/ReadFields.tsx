import { DisableReadObject } from "./DisableReadObject";
import { OptionalFieldMappings, RequiredFieldMappings } from "./FieldMappings";
import { useClearOldFieldMappings } from "./FieldMappings/useClearOldFieldMappings";
import { ReadObjectMapping } from "./ObjectMapping";
import { OptionalFields } from "./OptionalFields";
import { ReEnableReadObject } from "./ReEnableReadObject";
import { RequiredFields } from "./RequiredFields";
import { ValueMappings } from "./ValueMapping";

export function ReadFields() {
  useClearOldFieldMappings();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <ReEnableReadObject />
      <ReadObjectMapping />
      <RequiredFields />
      <RequiredFieldMappings />
      <OptionalFieldMappings />
      <ValueMappings />
      <OptionalFields />
      <DisableReadObject />
    </div>
  );
}
