/**
 * CreateInstallationWizard - Multi-step wizard for creating an installation
 *
 * This wizard walks users through configuring each read object before
 * submitting the installation. Uses headless useLocalConfig() for draft state.
 *
 * Flow:
 * 1. Show list of all read objects from manifest
 * 2. User configures each object (field selection + mappings)
 * 3. Review step shows all configurations
 * 4. Submit creates the installation with all object configs
 */

import { useState } from "react";
import { Config } from "services/api";
import { useLocalConfig } from "src/headless";
import { useCreateInstallation } from "src/headless/installation/useCreateInstallation";
import { useManifest } from "src/headless/manifest/useManifest";

import { ConfigureObjectStep } from "./ConfigureObjectStep";

interface CreateInstallationWizardProps {
  onSuccess?: (installationId: string, config: Config) => void;
}

type WizardStep =
  | { type: "objects-list" }
  | { type: "configure-object"; objectName: string }
  | { type: "review" };

export function CreateInstallationWizard({
  onSuccess,
}: CreateInstallationWizardProps) {
  const { data: manifest } = useManifest();
  const { draft, get, readObject } = useLocalConfig();
  const { createInstallation, isPending: isCreating } = useCreateInstallation();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<WizardStep>({
    type: "objects-list",
  });

  const readObjects = manifest?.content?.read?.objects || [];

  // Helper to check if an object has been configured
  const isObjectConfigured = (objectName: string) => {
    const obj = readObject(objectName);
    const requiredFields =
      manifest?.content?.read?.objects
        ?.find((o) => o.objectName === objectName)
        ?.requiredFields?.filter((f) => "fieldName" in f) || [];

    // Check if all required fields are selected
    return requiredFields.every((field) => {
      if ("fieldName" in field) {
        return obj.getSelectedField(field.fieldName);
      }
      return false;
    });
  };

  // Get the next unconfigured object
  const getNextUnconfiguredObject = (): string | null => {
    const unconfigured = readObjects.find(
      (obj) => !isObjectConfigured(obj.objectName),
    );
    return unconfigured?.objectName || null;
  };

  const handleSubmit = () => {
    const config = get();
    createInstallation({
      config,
      onSuccess: (installation) => {
        onSuccess?.(installation.id, installation.config);
      },
      onError: (error) => {
        console.error("Failed to create installation:", error);
      },
    });
  };

  // Calculate progress
  const configuredCount = readObjects.filter((obj) =>
    isObjectConfigured(obj.objectName),
  ).length;

  // Progress indicator component (shown on all steps)
  const ProgressIndicator = () => (
    <div
      style={{
        marginBottom: "24px",
        padding: "12px",
        background: "#f0f9ff",
        borderRadius: "6px",
        border: "1px solid #0891b2",
      }}
    >
      <div style={{ fontSize: "14px", fontWeight: 600, color: "#0891b2" }}>
        Progress: {configuredCount} / {readObjects.length} objects configured
      </div>
      <div
        style={{
          marginTop: "8px",
          height: "8px",
          background: "#e2e8f0",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${(configuredCount / readObjects.length) * 100}%`,
            height: "100%",
            background: "#0891b2",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );

  // Configure object step
  if (currentStep.type === "configure-object") {
    return (
      <div style={{ padding: "20px", fontFamily: "system-ui" }}>
        <ProgressIndicator />
        <ConfigureObjectStep
          objectName={currentStep.objectName}
          onBack={() => setCurrentStep({ type: "objects-list" })}
          onNext={() => {
            // After configuring, check if there are more unconfigured objects
            const nextObject = getNextUnconfiguredObject();
            if (nextObject) {
              setCurrentStep({
                type: "configure-object",
                objectName: nextObject,
              });
            } else {
              // All objects configured, go to review
              setCurrentStep({ type: "review" });
            }
          }}
        />
      </div>
    );
  }

  // Review step
  if (currentStep.type === "review") {
    const hasWriteObjects =
      draft.write?.objects && Object.keys(draft.write.objects).length > 0;

    return (
      <div style={{ padding: "20px", fontFamily: "system-ui" }}>
        <ProgressIndicator />
        <h2>Review Configuration</h2>
        <p style={{ color: "#64748b", marginTop: "8px" }}>
          Review your configuration before creating the installation
        </p>

        {/* Read Objects */}
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>
            Read Objects
          </h3>
          <pre
            style={{
              background: "#f1f5f9",
              padding: "12px",
              borderRadius: "4px",
              overflow: "auto",
              fontSize: "12px",
            }}
          >
            {JSON.stringify(draft.read?.objects, null, 2)}
          </pre>
        </div>

        {/* Write Objects */}
        {hasWriteObjects && (
          <div style={{ marginTop: "20px" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>
              Write Objects
              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "#64748b",
                }}
              >
                (
                {draft.write?.objects
                  ? Object.keys(draft.write.objects).length
                  : 0}{" "}
                enabled)
              </span>
            </h3>
            <pre
              style={{
                background: "#fefce8",
                padding: "12px",
                borderRadius: "4px",
                overflow: "auto",
                fontSize: "12px",
                border: "1px solid #fde047",
              }}
            >
              {JSON.stringify(draft.write?.objects, null, 2)}
            </pre>
          </div>
        )}

        <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
          <button
            type="button"
            onClick={() => setCurrentStep({ type: "objects-list" })}
            style={{
              padding: "8px 16px",
              background: "#e2e8f0",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Back to Edit
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isCreating}
            style={{
              padding: "8px 16px",
              background: "#0891b2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isCreating ? "not-allowed" : "pointer",
              opacity: isCreating ? 0.6 : 1,
            }}
          >
            {isCreating ? "Creating..." : "Create Installation"}
          </button>
        </div>
      </div>
    );
  }

  // Objects list step
  const allConfigured = configuredCount === readObjects.length;

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui" }}>
      <ProgressIndicator />
      <h2>Configure Installation</h2>
      <p style={{ color: "#64748b", marginTop: "8px" }}>
        Select and configure the objects you want to sync
      </p>

      <div style={{ marginTop: "24px" }}>
        <h3>Available Objects</h3>
        <div style={{ marginTop: "12px" }}>
          {readObjects.map((obj) => {
            const configured = isObjectConfigured(obj.objectName);
            return (
              <div
                key={obj.objectName}
                onClick={() =>
                  setCurrentStep({
                    type: "configure-object",
                    objectName: obj.objectName,
                  })
                }
                style={{
                  padding: "12px",
                  background: configured ? "#f0fdf4" : "#f8fafc",
                  borderRadius: "6px",
                  marginBottom: "8px",
                  border: `1px solid ${configured ? "#22c55e" : "#e2e8f0"}`,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{obj.objectName}</div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#64748b",
                        marginTop: "4px",
                      }}
                    >
                      {obj.displayName || obj.objectName}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        marginTop: "8px",
                      }}
                    >
                      Required fields: {obj.requiredFields?.length || 0} |
                      Optional fields: {obj.optionalFields?.length || 0}
                    </div>
                  </div>
                  {configured ? (
                    <div
                      style={{
                        fontSize: "20px",
                        color: "#22c55e",
                      }}
                    >
                      ✓
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "4px 8px",
                        background: "#0891b2",
                        color: "white",
                        borderRadius: "4px",
                        fontSize: "12px",
                      }}
                    >
                      Configure
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={() => {
            const nextObject = getNextUnconfiguredObject();
            if (nextObject) {
              setCurrentStep({
                type: "configure-object",
                objectName: nextObject,
              });
            }
          }}
          disabled={allConfigured}
          style={{
            padding: "8px 16px",
            background: allConfigured ? "#e2e8f0" : "#0891b2",
            color: allConfigured ? "#94a3b8" : "white",
            border: "none",
            borderRadius: "4px",
            cursor: allConfigured ? "not-allowed" : "pointer",
          }}
        >
          Configure Next Object
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep({ type: "review" })}
          disabled={!allConfigured}
          style={{
            padding: "8px 16px",
            background: allConfigured ? "#0891b2" : "#e2e8f0",
            color: allConfigured ? "white" : "#94a3b8",
            border: "none",
            borderRadius: "4px",
            cursor: allConfigured ? "pointer" : "not-allowed",
          }}
        >
          Review & Create
        </button>
      </div>
    </div>
  );
}
