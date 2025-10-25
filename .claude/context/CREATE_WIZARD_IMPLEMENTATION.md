# CreateInstallationWizard Implementation

## Overview

Built a multi-step wizard for creating installations that walks users through configuring all objects before submitting. This wizard uses the existing headless hooks (`useLocalConfig`, `useManifest`, `useCreateInstallation`) for state management.

## Architecture

### Component Structure

```
CreateInstallationWizard (Main orchestrator)
├── Objects List Step (shows all objects + progress)
├── ConfigureObjectStep (configure each object individually)
│   └── SmartFieldSuggest (AI-powered field mapping)
└── Review Step (final review before submit)
```

### Files Created

1. **`src/components/Configure/content/wizard/CreateInstallationWizard.tsx`**
   - Main wizard orchestration
   - 3-step flow: objects-list → configure-object → review
   - Progress tracking (shows X/Y objects configured)
   - Uses `useLocalConfig()` for draft state

2. **`src/components/Configure/content/wizard/ConfigureObjectStep.tsx`**
   - Individual object configuration UI
   - Field selection (checkboxes for required/optional)
   - Field mapping with AI suggestions
   - Integrates `SmartFieldSuggest` component

## Key Features

### 1. Multi-Step Wizard Flow

**Step 1: Objects List**
- Shows all available read objects from manifest
- Visual indicators for configured vs unconfigured objects
- Progress bar showing completion percentage
- Click any object to configure it
- "Configure Next Object" button for guided flow
- "Review & Create" button (only enabled when all objects configured)

**Step 2: Configure Object** (repeated for each object)
- Shows required fields (auto-selected, cannot be unconfigured)
- Shows optional fields (user can select/deselect)
- Field mapping UI for each field
- AI-powered suggestions via `SmartFieldSuggest`
- "Back" to return to objects list
- "Next" to proceed to next unconfigured object or review

**Step 3: Review**
- Shows complete configuration JSON
- "Back to Edit" to return to objects list
- "Create Installation" button to submit
- Loading state during creation

### 2. Progress Tracking

```tsx
const isObjectConfigured = (objectName: string) => {
  const obj = readObject(objectName);
  const requiredFields = manifest?.content?.read?.objects
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
```

Visual progress indicator:
```
Progress: 2 / 5 objects configured
[████████░░░░░░░░░░] 40%
```

### 3. AI-Powered Field Mapping

When user clicks "Map Field" on any field:
- Shows `SmartFieldSuggest` component inline
- AI analyzes field name, type, and patterns
- Suggests top 3 matches from customer's available fields
- One-click to apply suggestion
- Auto-selects field if applying mapping

```tsx
<SmartFieldSuggest
  requiredField={field}
  availableFields={customerFields.allFields}
  currentSelection={currentMapping}
  onAcceptSuggestion={(suggestedFieldName) => {
    // Apply mapping
    objectHandlers.setFieldMapping({ fieldName, mapToName: suggestedFieldName });
    // Auto-select field
    objectHandlers.setSelectedField({ fieldName, selected: true });
  }}
/>
```

### 4. State Management with useLocalConfig

The wizard uses the existing `useLocalConfig()` hook from headless:

```tsx
const { draft, get, readObject } = useLocalConfig();

// For each object
const objectHandlers = readObject(objectName);

// Select field
objectHandlers.setSelectedField({ fieldName: "email", selected: true });

// Map field
objectHandlers.setFieldMapping({ fieldName: "email", mapToName: "contact_email" });

// Get current selection
const isSelected = objectHandlers.getSelectedField("email");
const mapping = objectHandlers.getFieldMapping("email");

// On submit
const config = get(); // Returns complete config
createInstallation({ config, onSuccess, onError });
```

## User Experience Flow

1. User sees list of all objects (e.g., Contacts, Companies, Deals)
2. Each object shows:
   - Object name and display name
   - Required and optional field counts
   - Configuration status (✓ or "Configure" button)
3. User clicks object or "Configure Next Object"
4. Sees required fields (auto-selected, disabled)
5. Sees optional fields (can toggle on/off)
6. For each field, can click "Map Field" to:
   - See AI suggestions with confidence scores
   - One-click apply best match
   - Manual field selection also available
7. Clicks "Next" → automatically goes to next unconfigured object
8. Once all objects configured, clicks "Review & Create"
9. Reviews final JSON configuration
10. Clicks "Create Installation" → calls API

## Validation

**Required Field Validation:**
- Objects are only considered "configured" when ALL required fields are selected
- "Review & Create" button is disabled until all objects are configured
- Required fields cannot be deselected (checkbox is disabled)

**Visual Feedback:**
- Configured objects: Green background (#f0fdf4), green border, green checkmark
- Unconfigured objects: Gray background, blue "Configure" button
- Progress bar updates in real-time as objects are configured

## Integration with InstallationContentV2

```tsx
export function InstallationContentV2(_props: InstallationContentV2Props) {
  const { installation } = useInstallation();

  // Route based on installation state
  if (installation) {
    return <UpdateInstallation installation={installation} />;
  }

  // No installation - show create wizard
  return <CreateInstallationWizard onSuccess={_props.onInstallSuccess} />;
}
```

## Future Enhancements

1. **Auto-advance**: After configuring an object, automatically proceed to next
2. **Skip optional objects**: Allow users to skip objects with no required fields
3. **Bulk mapping**: Apply same mapping pattern across multiple objects
4. **Save draft**: Persist wizard progress to localStorage
5. **Validation warnings**: Show warnings for unmapped optional fields
6. **Field preview**: Show sample data for mapped fields
7. **Undo/Redo**: Track configuration history

## Technical Notes

### TypeScript Union Type Handling

The `HydratedIntegrationField` type is a union, requiring type guards:

```tsx
const fieldName = "fieldName" in field ? field.fieldName : field.mapToName || "";
```

### Wizard State Management

Used discriminated union for type-safe step transitions:

```tsx
type WizardStep =
  | { type: "objects-list" }
  | { type: "configure-object"; objectName: string }
  | { type: "review" };

setCurrentStep({ type: "configure-object", objectName: "contacts" });
```

### Build Status

✅ Build passes with 0 errors
- ES bundle: 551.67 kB
- CJS bundle: 380.71 kB

## References

- Headless hooks: `src/headless/`
- Manifest API: `src/headless/manifest/useManifest.ts`
- Config management: `src/headless/config/useConfigHelper.tsx`
- AI suggestions: `src/components/Configure/ai/SmartFieldSuggest.tsx`
