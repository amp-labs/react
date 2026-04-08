import { useMemo } from "react";
import {
  HydratedIntegrationFieldExistent,
  IntegrationFieldMapping,
} from "services/api";
import { ComboBox } from "src/components/ui-base/ComboBox/ComboBox";
import { LabelTooltip } from "src/components/ui-base/Tooltip";
import { ErrorBoundary, useErrorState } from "src/context/ErrorContextProvider";

import { useSelectedConfigureState } from "../../useSelectedConfigureState";

import { setFieldMapping } from "./setFieldMapping";

export const DUPLICATE_FIELD_ERROR_MESSAGE =
  "Each field must be mapped to a unique value";

interface FieldMappingRowProps {
  field: IntegrationFieldMapping;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  allFields: HydratedIntegrationFieldExistent[];
}

export function FieldMappingRow({
  field,
  onSelectChange,
  allFields,
}: FieldMappingRowProps) {
  const { configureState, selectedObjectName, setConfigureState } =
    useSelectedConfigureState();
  const { isError, removeError, getError } = useErrorState();
  const selectedFieldMappings = configureState?.read?.selectedFieldMappings;
  const fieldValue = selectedFieldMappings?.[field.mapToName];

  const items = useMemo(
    () =>
      allFields
        .map((f) => ({
          id: f.fieldName,
          label: f.displayName,
          value: f.fieldName,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [allFields],
  );

  const SelectComponent = (
    <ComboBox
      items={items}
      selectedValue={fieldValue || null}
      onSelectedItemChange={(item) => {
        if (item) {
          onSelectChange({
            target: {
              name: field.mapToName,
              value: item.value,
            } as unknown as HTMLSelectElement,
          } as unknown as React.ChangeEvent<HTMLSelectElement>);
        } else if (selectedObjectName) {
          setFieldMapping(selectedObjectName, setConfigureState, [
            {
              field: field.mapToName,
              value: null,
            },
          ]);

          if (isError(ErrorBoundary.MAPPING, selectedObjectName)) {
            removeError(ErrorBoundary.MAPPING, selectedObjectName);
          }
        }
      }}
      placeholder="Please select one"
      style={{ width: "100%" }}
      clearable
    />
  );

  // Errors are tracked per field by storing an array of field names that have errors
  // under the selectedObjectName key in the error boundary. If a field name exists
  // in this array, it means that field has a duplicate mapping error.
  const { hasDuplicationError, errorMessage } = useMemo(() => {
    const errs = getError(ErrorBoundary.MAPPING, selectedObjectName!);
    const hasDupErrors =
      Array.isArray(errs) && errs.length > 0 && errs.includes(field.mapToName);
    return {
      hasDuplicationError: hasDupErrors,
      errorMessage: hasDupErrors ? DUPLICATE_FIELD_ERROR_MESSAGE : "",
    };
  }, [selectedObjectName, getError, field.mapToName]);

  return (
    <>
      <div
        key={field.mapToName}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: ".25rem",
            marginBottom: ".25rem",
          }}
        >
          <span style={{ fontWeight: 500 }}>
            {field.mapToDisplayName ?? field.mapToName}
          </span>
          <span>
            {field?.prompt && (
              <LabelTooltip
                id={`tooltip-id-${field?.prompt}`}
                tooltipText={field?.prompt}
              />
            )}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: ".25rem" }}>
          {SelectComponent}
        </div>
      </div>
      {hasDuplicationError && (
        <span
          key={field.mapToName}
          style={{ color: "red", fontSize: "14px", marginTop: "4px" }}
        >
          {" "}
          {errorMessage}{" "}
        </span>
      )}
    </>
  );
}
