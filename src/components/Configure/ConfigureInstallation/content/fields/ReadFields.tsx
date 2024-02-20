import { RequiredFieldMappings } from './FieldMappings';
import { OptionalFields } from './OptionalFields';
import { RequiredFields } from './RequiredFields';

export function ReadFields() {
  return (
    <>
      <RequiredFields />
      <RequiredFieldMappings />
      <OptionalFields />
    </>
  );
}
