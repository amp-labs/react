# InstallIntegrationV2 Usage Guide

## Overview

InstallIntegrationV2 is the next-generation component for handling integration installations with:
- **Headless architecture** - Uses hooks instead of heavy context providers
- **Smart AI suggestions** - Client-side pattern matching for field mappings
- **Contextual help** - Built-in tooltips and guidance
- **Simplified API** - Fewer nested providers, cleaner code

## Basic Usage

### Simple Integration

```tsx
import { InstallIntegrationV2 } from 'src/components/Configure/InstallIntegrationV2';

function MyApp() {
  return (
    <InstallIntegrationV2
      integration="salesforce"
      consumerRef="user_123"
      consumerName="John Doe"
      groupRef="org_456"
      groupName="Acme Corp"
      onInstallSuccess={(installationId, config) => {
        console.log('Installation created:', installationId);
      }}
      onUpdateSuccess={(installationId, config) => {
        console.log('Installation updated:', installationId);
      }}
      onUninstallSuccess={(installationId) => {
        console.log('Installation deleted:', installationId);
      }}
    />
  );
}
```

## AI-Enhanced Components

### Using Smart Field Suggestions

The `SmartFieldSuggest` component provides intelligent field mapping suggestions:

```tsx
import { SmartFieldSuggest } from 'src/components/Configure/ai/SmartFieldSuggest';
import { useManifest } from 'src/headless';

function FieldMappingForm() {
  const manifest = useManifest();
  const requiredFields = manifest.getReadObject('contact').getRequiredFields();
  const availableFields = manifest.getCustomerFieldsForObject('contact').allFields;

  return (
    <div>
      {requiredFields?.map((field) => (
        <div key={field.fieldName}>
          <label>{field.fieldName}</label>

          {/* Your field selector */}
          <select>
            {Object.keys(availableFields).map((fieldName) => (
              <option key={fieldName} value={fieldName}>
                {fieldName}
              </option>
            ))}
          </select>

          {/* Smart suggestions */}
          <SmartFieldSuggest
            requiredField={field}
            availableFields={availableFields}
            onAcceptSuggestion={(fieldName) => {
              // Auto-fill the field
              console.log('Accepted suggestion:', fieldName);
            }}
          />
        </div>
      ))}
    </div>
  );
}
```

### Using Contextual Help

Add helpful tooltips and guidance:

```tsx
import { ContextualHelp, QuickTip } from 'src/components/Configure/ai/ContextualHelp';

function FieldWithHelp({ field }) {
  return (
    <div>
      <label>
        {field.fieldName}
        {field.required && <span>*</span>}
        <ContextualHelp field={field} mode="tooltip" />
      </label>

      <input type="text" />

      <QuickTip
        message="This field helps identify unique contacts"
        type="info"
      />
    </div>
  );
}
```

### Using Error Help

Provide smart error recovery suggestions:

```tsx
import { ErrorHelp } from 'src/components/Configure/ai/ContextualHelp';
import { suggestErrorFix } from 'src/components/Configure/ai/utils/smartSuggestions';

function FieldWithValidation({ field, error, availableFields }) {
  const suggestion = error
    ? suggestErrorFix(error.message, field.fieldName, availableFields)
    : null;

  return (
    <div>
      <input type="text" />

      {error && (
        <ErrorHelp
          errorMessage={error.message}
          fieldName={field.fieldName}
          suggestion={suggestion}
        />
      )}
    </div>
  );
}
```

## Using Headless Hooks Directly

For custom implementations, use the headless hooks:

```tsx
import {
  useInstallation,
  useCreateInstallation,
  useUpdateInstallation,
  useDeleteInstallation,
  useManifest,
  useConnection,
  InstallationProvider,
} from 'src/headless';

function CustomInstallationFlow() {
  return (
    <InstallationProvider
      integration="hubspot"
      consumerRef="user_123"
      groupRef="org_456"
    >
      <CustomContent />
    </InstallationProvider>
  );
}

function CustomContent() {
  // Get installation data
  const { installation, isPending, isError } = useInstallation();

  // Get manifest (field definitions)
  const manifest = useManifest();
  const contactObject = manifest.getReadObject('contact');
  const requiredFields = contactObject.getRequiredFields();

  // Get connection
  const { connection } = useConnection();

  // Create installation mutation
  const { createInstallation, isPending: isCreating } = useCreateInstallation();

  // Update installation mutation
  const { updateInstallation, isPending: isUpdating } = useUpdateInstallation();

  // Delete installation mutation
  const { deleteInstallation } = useDeleteInstallation();

  const handleCreate = () => {
    createInstallation({
      config: {
        read: {
          objects: {
            contact: {
              objectName: 'contact',
              destination: 'contacts',
              schedule: '0 */6 * * *',
              fieldMappings: {
                email: 'emailAddress',
                firstName: 'first_name',
              },
            },
          },
        },
      },
      onSuccess: (installation) => {
        console.log('Created:', installation.id);
      },
      onError: (error) => {
        console.error('Failed:', error.message);
      },
    });
  };

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error loading installation</div>;

  return (
    <div>
      {installation ? (
        <div>
          <h2>Update Installation</h2>
          <button onClick={() => updateInstallation({ config: {...} })}>
            Update
          </button>
          <button onClick={() => deleteInstallation({})}>
            Delete
          </button>
        </div>
      ) : (
        <div>
          <h2>Create Installation</h2>
          <button onClick={handleCreate}>
            Create
          </button>
        </div>
      )}
    </div>
  );
}
```

## AI Utilities API

### Generate Smart Defaults

Automatically suggest field mappings for an entire object:

```tsx
import { generateSmartDefaults } from 'src/components/Configure/ai/utils/smartSuggestions';

function AutoConfigForm() {
  const manifest = useManifest();
  const contactObject = manifest.getReadObject('contact').object;
  const availableFields = manifest.getCustomerFieldsForObject('contact').allFields;

  const { suggestedMappings, confidence } = generateSmartDefaults(
    contactObject,
    availableFields
  );

  // suggestedMappings = { email: 'emailAddress', firstName: 'first_name', ... }
  // confidence = { email: 0.95, firstName: 0.88, ... }

  return (
    <div>
      {Object.entries(suggestedMappings).map(([requiredField, suggestedField]) => (
        <div key={requiredField}>
          {requiredField} → {suggestedField}
          ({Math.round(confidence[requiredField] * 100)}% confident)
        </div>
      ))}
    </div>
  );
}
```

### Detect Field Relationships

Identify related fields that should be configured together:

```tsx
import { detectFieldRelationships } from 'src/components/Configure/ai/utils/smartSuggestions';

function SmartFieldGroups() {
  const manifest = useManifest();
  const requiredFields = manifest.getReadObject('contact').getRequiredFields();

  const relationships = detectFieldRelationships(requiredFields);

  // relationships = {
  //   'firstName': ['lastName'],
  //   'address': ['city', 'state', 'postalCode']
  // }

  return (
    <div>
      {Object.entries(relationships).map(([parent, children]) => (
        <fieldset key={parent}>
          <legend>{parent} (and related fields)</legend>
          {children.map(child => (
            <div key={child}>{child}</div>
          ))}
        </fieldset>
      ))}
    </div>
  );
}
```

## Architecture Comparison

### V1 (Legacy)
```
InstallIntegration
└── InstallIntegrationErrorBoundary
    └── InstallationProvider (headless)
        └── InstallIntegrationContent
            └── InstallIntegrationProvider (LEGACY - heavy context)
                └── ConnectionsProvider
                    └── ProtectedConnectionLayout
                        └── HydratedRevisionProvider
                            └── ConditionalHasConfigurationLayout
                                └── ConfigurationProvider
                                    └── ObjectManagementNav
                                        └── InstallationContent

Components use: useInstallIntegrationProps() from context
```

### V2 (New)
```
InstallIntegrationV2
└── InstallIntegrationErrorBoundary
    └── InstallationProvider (headless)
        └── InstallationContentV2
            └── Your components using hooks directly

Components use: useInstallation(), useCreateInstallation(), etc.
```

## Benefits of V2

1. **Simpler Mental Model**
   - Data fetching via hooks (React Query under the hood)
   - No complex provider hierarchy to understand
   - Clear separation between data and UI

2. **Better Performance**
   - Fewer provider re-renders
   - Optimized query caching
   - Smaller component tree

3. **Easier Testing**
   - Mock hooks instead of context
   - Test components in isolation
   - No provider setup needed

4. **AI-Enhanced UX**
   - Smart field suggestions out of the box
   - Contextual help everywhere
   - Error recovery guidance
   - Pattern-based defaults

5. **Developer Experience**
   - TypeScript types from hooks
   - Self-documenting API
   - Easy to extend
   - Familiar React Query patterns

## Migration Path

If you have existing code using V1:

1. **Keep V1 running** - V2 doesn't replace V1 yet
2. **Try V2 in new features** - Use V2 for new integration flows
3. **Gradually migrate** - Move components one at a time
4. **Test thoroughly** - Both work side-by-side

## Troubleshooting

### "useInstallationProps must be used within an InstallationProvider"

Make sure your component is wrapped with `InstallationProvider`:

```tsx
<InstallationProvider integration="..." consumerRef="..." groupRef="...">
  <YourComponent />
</InstallationProvider>
```

### Smart suggestions not showing

Ensure you're passing both `requiredField` and `availableFields` to `SmartFieldSuggest`:

```tsx
const availableFields = manifest.getCustomerFieldsForObject('contact').allFields;

<SmartFieldSuggest
  requiredField={field}
  availableFields={availableFields || {}}  // Provide fallback
  onAcceptSuggestion={handleAccept}
/>
```

### TypeScript errors with config types

Use the exported types from headless:

```tsx
import type { InstallationConfigContent } from 'src/headless';

const config: InstallationConfigContent = {
  read: {
    objects: { ... }
  }
};
```

## Next Steps

- See `.claude/context/MIGRATION_PLAN.md` for implementation roadmap
- See `.claude/context/install-integration-migration.md` for architecture details
- Check `src/headless/` for all available hooks
- Look at V1 components for examples of hook usage (CreateInstallation, UpdateInstallation already use hooks)
