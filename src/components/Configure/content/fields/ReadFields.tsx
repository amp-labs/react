import { RequiredFieldMappings } from './FieldMappings';
import { ReadObjectMapping } from './ObjectMapping';
import { OptionalFields } from './OptionalFields';
import { RequiredFields } from './RequiredFields';

export function ReadFields() {
  return (
    <>
      <ReadObjectMapping />
      <RequiredFields />
      <RequiredFieldMappings />
      <OptionalFields />
    </>
  );
}
