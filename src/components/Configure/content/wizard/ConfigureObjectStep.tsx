/**
 * ConfigureObjectStep - UI for configuring a single object's fields
 *
 * Allows users to:
 * 1. Select which fields to sync
 * 2. Map field names if needed
 * 3. Get AI-powered suggestions for field mappings
 */

import { useMemo, useState } from "react";
import {
  HydratedIntegrationField,
  HydratedIntegrationFieldExistent,
  IntegrationFieldMapping,
} from "@generated/api/src";
import { Button } from "src/components/ui-base/Button";
import {
  CheckboxItem,
  CheckboxPagination,
} from "src/components/ui-base/Checkbox/CheckboxPagination";
import { ComboBox } from "src/components/ui-base/ComboBox/ComboBox";
import { useLocalConfig } from "src/headless";
import { useManifest } from "src/headless/manifest/useManifest";

import { SmartFieldSuggest } from "../../ai/SmartFieldSuggest";
import { isIntegrationFieldMapping } from "../../utils";

interface ConfigureObjectStepProps {
  objectName: string;
  onBack: () => void;
  onNext: () => void;
}

export function ConfigureObjectStep({
  objectName,
  onBack,
  onNext,
}: ConfigureObjectStepProps) {
  const { getReadObject, getCustomerFieldsForObject } = useManifest();
  const { readObject } = useLocalConfig();

  const objectHandlers = readObject(objectName);
  const manifestObject = getReadObject(objectName);
  const customerFields = getCustomerFieldsForObject(objectName);

  // Split fields into those with and without mappings

  const requiredFieldsAll = useMemo(
    () => manifestObject.getRequiredFields() || [],
    [manifestObject],
  );

  const requiredFieldNoMappings = useMemo(
    () =>
      requiredFieldsAll.filter(
        (field): field is HydratedIntegrationFieldExistent =>
          !isIntegrationFieldMapping(field) && !!field.fieldName,
      ),
    [requiredFieldsAll],
  );
  const requiredFieldMappings = useMemo(
    () =>
      requiredFieldsAll.filter(
        (field): field is IntegrationFieldMapping =>
          isIntegrationFieldMapping(field) && !!field.mapToName,
      ),
    [requiredFieldsAll],
  );

  const optionalFieldsAll = useMemo(
    () => manifestObject.getOptionalFields() || [],
    [manifestObject],
  );
  const optionalFieldNoMappings: HydratedIntegrationFieldExistent[] = useMemo(
    () =>
      optionalFieldsAll.filter(
        (field): field is HydratedIntegrationFieldExistent =>
          !isIntegrationFieldMapping(field) && !!field.fieldName,
      ),
    [optionalFieldsAll],
  );
  const optionalFieldMappings: IntegrationFieldMapping[] = useMemo(
    () =>
      optionalFieldsAll.filter(
        (field): field is IntegrationFieldMapping =>
          isIntegrationFieldMapping(field) && !!field.mapToName,
      ),
    [optionalFieldsAll],
  );

  console.group("fields");
  console.log("requiredFieldNoMappings", requiredFieldNoMappings);
  console.log("requiredFieldMappings", requiredFieldMappings);
  console.log("optionalFieldNoMappings", optionalFieldNoMappings);
  console.log("optionalFieldMappings", optionalFieldMappings);
  console.groupEnd();

  // Track which field is being mapped (for showing SmartFieldSuggest)
  const [mappingField, setMappingField] = useState<string | null>(null);

  // Convert optional fields to checkbox items for V1 CheckboxPagination
  const optionalCheckboxItems = useMemo<CheckboxItem[]>(
    () =>
      optionalFieldNoMappings
        .map((field) => ({
          id: field.fieldName,
          label: field.displayName || field.fieldName,
          isChecked: !!objectHandlers.getSelectedField(field.fieldName),
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [optionalFieldNoMappings, objectHandlers],
  );

  const handleOptionalFieldChange = (id: string, checked: boolean) => {
    objectHandlers.setSelectedField({ fieldName: id, selected: checked });
  };

  // Render field mapping row (for Required/Optional Field Mappings sections)
  const renderFieldMappingRow = (field: IntegrationFieldMapping) => {
    const currentMapping = objectHandlers.getFieldMapping(field.mapToName);

    const comboBoxItems = customerFields.allFields
      ? Object.entries(customerFields.allFields).map(
          ([fieldName, metadata]) => ({
            id: fieldName,
            label: metadata.displayName || fieldName,
            value: fieldName,
          }),
        )
      : [];

    const handleMappingChange = (
      item: { id: string; label: string; value: string } | null,
    ) => {
      if (item) {
        objectHandlers.setFieldMapping({
          fieldName: item.value,
          mapToName: field.mapToName,
        });
      }
    };

    const handleClear = () => {
      // Clear the mapping - set to empty/null
      objectHandlers.setFieldMapping({
        fieldName: "",
        mapToName: field.mapToName,
      });
    };

    return (
      <div key={field.mapToName} style={{ marginBottom: "16px" }}>
        <div style={{ fontWeight: 500, marginBottom: "8px" }}>
          {field.mapToDisplayName || field.mapToName}
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <ComboBox
              items={comboBoxItems}
              selectedValue={currentMapping || null}
              onSelectedItemChange={handleMappingChange}
              placeholder="Please select one"
              style={{ width: "100%" }}
            />
          </div>
          <Button type="button" variant="ghost" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </div>
    );
  };

  const handleFieldToggle = (fieldName: string, isRequired: boolean) => {
    if (isRequired) return; // Can't toggle required fields

    const currentlySelected = objectHandlers.getSelectedField(fieldName);
    objectHandlers.setSelectedField({
      fieldName,
      selected: !currentlySelected,
    });
  };

  const handleAcceptSuggestion = (fieldName: string, mapToName: string) => {
    // Apply the mapping
    objectHandlers.setFieldMapping({ fieldName, mapToName });
    // Select the field if not already selected
    if (!objectHandlers.getSelectedField(fieldName)) {
      objectHandlers.setSelectedField({ fieldName, selected: true });
    }
    // Close the suggestions
    setMappingField(null);
  };

  const renderOptionalFieldRow = (field: HydratedIntegrationField) => {
    // Handle the union type - check if it's an existent field with fieldName
    const fieldName =
      "fieldName" in field ? field.fieldName : field.mapToName || "";
    if (!fieldName) return null;

    const isSelected = objectHandlers.getSelectedField(fieldName);
    const currentMapping = objectHandlers.getFieldMapping(fieldName);
    const isShowingSuggestions = mappingField === fieldName;

    return (
      <div
        key={fieldName}
        style={{
          padding: "12px",
          background: isSelected ? "#f0f9ff" : "#f8fafc",
          borderRadius: "6px",
          marginBottom: "8px",
          border: `1px solid ${isSelected ? "#0891b2" : "#e2e8f0"}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleFieldToggle(fieldName, false)}
            style={{ cursor: "pointer" }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{fieldName}</div>
            {currentMapping && (
              <div
                style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}
              >
                Maps to: <strong>{currentMapping}</strong>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() =>
              setMappingField(isShowingSuggestions ? null : fieldName)
            }
            style={{
              padding: "6px 12px",
              background: isShowingSuggestions ? "#0891b2" : "#e2e8f0",
              color: isShowingSuggestions ? "white" : "#334155",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            {isShowingSuggestions ? "Hide Suggestions" : "Map Field"}
          </button>
        </div>

        {isShowingSuggestions && customerFields.allFields && (
          <div
            style={{
              marginTop: "12px",
              paddingTop: "12px",
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <SmartFieldSuggest
              requiredField={field}
              availableFields={customerFields.allFields}
              currentSelection={currentMapping}
              onAcceptSuggestion={(suggestedFieldName: string) =>
                handleAcceptSuggestion(fieldName, suggestedFieldName)
              }
            />
          </div>
        )}
      </div>
    );
  };

  const renderRequiredFieldPill = (field: HydratedIntegrationField) => {
    const fieldName =
      "fieldName" in field ? field.fieldName : field.mapToName || "";
    if (!fieldName) return null;

    const currentMapping = objectHandlers.getFieldMapping(fieldName);

    return (
      <div
        key={fieldName}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 12px",
          background: "#f0fdf4",
          border: "1px solid #86efac",
          borderRadius: "6px",
          marginRight: "8px",
          marginBottom: "8px",
        }}
      >
        <div style={{ fontSize: "13px", fontWeight: 500, color: "#166534" }}>
          {fieldName}
        </div>
        {currentMapping && (
          <div
            style={{
              fontSize: "12px",
              color: "#15803d",
              paddingLeft: "8px",
              borderLeft: "1px solid #86efac",
            }}
          >
            → {currentMapping}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui" }}>
      <h2>Configure {objectName}</h2>
      <p style={{ color: "#64748b", marginTop: "8px" }}>
        Select the fields you want to sync and map them to your data source
      </p>

      {/* Required Fields */}
      {requiredFieldNoMappings.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>
            Required Fields
          </h3>
          <div
            style={{
              padding: "12px",
              background: "#f8fafc",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {requiredFieldNoMappings.map((field) =>
                renderRequiredFieldPill(field),
              )}
            </div>
            <div
              style={{
                marginTop: "8px",
                fontSize: "12px",
                color: "#64748b",
                fontStyle: "italic",
              }}
            >
              These fields are always included in the sync
            </div>
          </div>
        </div>
      )}

      {/* Optional Fields */}
      {optionalCheckboxItems.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>
            Optional Fields
          </h3>
          <CheckboxPagination
            key={`${objectName}-${optionalCheckboxItems.length}`}
            items={optionalCheckboxItems}
            onItemChange={handleOptionalFieldChange}
            showSelectAll={optionalCheckboxItems.length >= 2}
          />
        </div>
      )}

      {/* Required Field Mappings */}
      {requiredFieldMappings.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>
            Required Field Mappings
          </h3>
          <div>
            {requiredFieldMappings.map((field) => renderFieldMappingRow(field))}
          </div>
        </div>
      )}

      {/* Optional Field Mappings */}
      {optionalFieldMappings.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>
            Optional Field Mappings
          </h3>
          <div>
            {optionalFieldMappings.map((field) => renderFieldMappingRow(field))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={{ marginTop: "32px", display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            padding: "8px 16px",
            background: "#e2e8f0",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          style={{
            padding: "8px 16px",
            background: "#0891b2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
