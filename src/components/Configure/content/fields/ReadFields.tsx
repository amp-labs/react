// import { OptionalFields } from './OptionalFields';
import { OptionalFields } from './OptionalFields/radix/OptionalFieldsRadix';
import { RequiredFieldMappings } from './FieldMappings';
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
