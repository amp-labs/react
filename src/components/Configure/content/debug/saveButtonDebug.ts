/**
 * Debug helper for save button state tracking
 * Set DEBUG_SAVE_BUTTON to true to enable detailed logging
 */

const DEBUG_SAVE_BUTTON = true; // Toggle this to enable/disable debug logging

export const debugSaveButtonState = (data: Record<string, any>) => {
  if (!DEBUG_SAVE_BUTTON) return;

  console.log("🔍 Save Button Debug:", data);
};

export const debugZustandState = (action: string, data: Record<string, any>) => {
  if (!DEBUG_SAVE_BUTTON) return;

  const emojis: Record<string, string> = {
    updateMapping: "🔄",
    saveSnapshot: "📸",
    loadFromExternal: "📥",
    isDirty: "🎯",
    fieldDirty: "🏷️"
  };

  console.log(`${emojis[action] || "🔧"} Zustand ${action}:`, data);
};

export const debugButtonConditions = () => {
  if (!DEBUG_SAVE_BUTTON) return;

  console.log("💡 Save Button Enable Conditions:", {
    "✅ Enabled when": [
      "!loading (not loading)",
      "!isLoading (not processing)",
      "configureState exists",
      "selectedObjectName exists",
      "isStateNew = (isModified || isCreateMode || isSelectedReadObjectComplete)"
    ],
    "❌ Disabled when": [
      "Any of the above conditions are false"
    ],
    "🔄 isModified depends on": [
      "isOptionalFieldsModified",
      "isRequiredMapFieldsModified",
      "isValueMappingsModified (from Zustand)"
    ]
  });
};