import { FormControl } from "src/components/form/FormControl";
import {
  HydratedIntegrationFieldExistent,
  IntegrationFieldMapping,
} from "src/services/api";

import { FieldMappingRow } from "./FieldMappingRow";

export function DynamicFieldMappings({
  dynamicFieldMappings,
  onSelectChange,
  allFields,
}: {
  dynamicFieldMappings: IntegrationFieldMapping[];
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  allFields: HydratedIntegrationFieldExistent[];
}) {
  return dynamicFieldMappings.length ? (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {dynamicFieldMappings.map((field) => (
        <FormControl id={field.mapToName} key={field.mapToName}>
          <FieldMappingRow
            allFields={allFields}
            field={field}
            onSelectChange={onSelectChange}
          />
        </FormControl>
      ))}
    </div>
  ) : null;
}
