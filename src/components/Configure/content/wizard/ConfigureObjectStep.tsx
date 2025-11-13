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

import { isIntegrationFieldMapping } from "../../utils";

import { ObjectMappingCallout } from "./components/ObjectMappingCallout";

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
  const { getReadObject, getWriteObject, getCustomerFieldsForObject } =
    useManifest();
  const { readObject, writeObject } = useLocalConfig();

  const objectHandlers = readObject(objectName);
  const writeHandlers = writeObject(objectName);
  const manifestObject = getReadObject(objectName);
  const manifestWriteObject = getWriteObject(objectName);
  const customerFields = getCustomerFieldsForObject(objectName);

  // Track if write is enabled for this object
  const isWriteEnabled = !!writeHandlers.getWriteObject();

  // Track if showing all selected optional fields (for when > 10)
  const [showAllSelectedFields, setShowAllSelectedFields] = useState(false);

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
    <div style={{ fontFamily: "system-ui" }}>
      <h2>Configure {objectName}</h2>
      <p style={{ color: "#64748b", marginTop: "8px" }}>
        Select the fields you want to sync and map them to your data source
      </p>

      {/* Object Mapping Info */}
      <ObjectMappingCallout objectName={objectName} />

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

          {/* Selected Optional Fields Pills */}
          {optionalCheckboxItems.some((item) => item.isChecked) &&
            (() => {
              const selectedFields = optionalCheckboxItems.filter(
                (item) => item.isChecked,
              );
              const hasMany = selectedFields.length > 10;
              const displayedFields =
                hasMany && !showAllSelectedFields
                  ? selectedFields.slice(0, 10)
                  : selectedFields;

              return (
                <div style={{ marginTop: "16px" }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      marginBottom: "8px",
                      color: "#64748b",
                    }}
                  >
                    Selected Fields ({selectedFields.length})
                  </div>
                  <div
                    style={{
                      padding: "12px",
                      background: "#f0f9ff",
                      borderRadius: "6px",
                      border: "1px solid #bae6fd",
                    }}
                  >
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                    >
                      {displayedFields.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "6px 12px",
                            background: "#e0f2fe",
                            border: "1px solid #0891b2",
                            borderRadius: "6px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: 500,
                              color: "#0c4a6e",
                            }}
                          >
                            {item.label}
                          </div>
                        </div>
                      ))}
                      {hasMany && (
                        <button
                          type="button"
                          onClick={() =>
                            setShowAllSelectedFields(!showAllSelectedFields)
                          }
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "6px 12px",
                            background: "#e0f2fe",
                            border: "1px solid #0891b2",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#0c4a6e",
                          }}
                        >
                          {showAllSelectedFields
                            ? "Show Less ↑"
                            : `Show All (${selectedFields.length}) ↓`}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
        </div>
      )}

      {/* Write Configuration */}
      {manifestWriteObject.object && (
        <div style={{ marginTop: "32px" }}>
          <div
            style={{
              padding: "16px",
              background: "#fefce8",
              border: "1px solid #fde047",
              borderRadius: "6px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                >
                  Enable Write
                </h3>
                <p style={{ fontSize: "14px", color: "#78716c", margin: 0 }}>
                  Allow data to be written back to {objectName}
                </p>
              </div>
              <label
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: "48px",
                  height: "24px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={isWriteEnabled}
                  onChange={(e) => {
                    if (e.target.checked) {
                      writeHandlers.setEnableWrite();
                    } else {
                      writeHandlers.setDisableWrite();
                    }
                  }}
                  style={{
                    opacity: 0,
                    width: 0,
                    height: 0,
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    cursor: "pointer",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: isWriteEnabled ? "#0891b2" : "#cbd5e1",
                    transition: "0.3s",
                    borderRadius: "24px",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      content: '""',
                      height: "18px",
                      width: "18px",
                      left: isWriteEnabled ? "26px" : "3px",
                      bottom: "3px",
                      backgroundColor: "white",
                      transition: "0.3s",
                      borderRadius: "50%",
                    }}
                  />
                </span>
              </label>
            </div>
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
