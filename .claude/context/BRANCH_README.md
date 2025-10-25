# Branch: feat/install-integration-headless-migration

## What's in this branch?

This branch contains an **experimental V2 implementation** of the `InstallIntegration` component with:

1. **Headless architecture** - Simplified from 10+ nested providers to ~2-3
2. **AI-powered UX** - Smart field suggestions, contextual help, error recovery
3. **Better DX** - Uses hooks directly instead of heavy context providers

## Status: ✅ Prototype Complete

All core components have been built:
- ✅ InstallIntegrationV2 main component
- ✅ InstallationContentV2 using headless hooks
- ✅ Smart field suggestion system
- ✅ Contextual help components
- ✅ AI utility functions
- ✅ Documentation and examples

## Quick Start

### Using V2 Component

```tsx
import { InstallIntegrationV2 } from 'src/components/Configure/InstallIntegrationV2';

<InstallIntegrationV2
  integration="salesforce"
  consumerRef="user_123"
  groupRef="org_456"
  onInstallSuccess={(id, config) => console.log('Installed:', id)}
/>
```

### Using AI Components

```tsx
import {
  SmartFieldSuggest,
  ContextualHelp,
  generateSmartDefaults,
} from 'src/components/Configure/ai';

// In your field mapping component:
<SmartFieldSuggest
  requiredField={field}
  availableFields={customerFields}
  onAcceptSuggestion={(fieldName) => {
    // Auto-fill the field
  }}
/>

<ContextualHelp field={field} mode="tooltip" />
```

## What Changed?

### Before (V1)
```
10+ nested providers
Heavy InstallIntegrationProvider context
Complex data flow through multiple layers
```

### After (V2)
```
2-3 providers (InstallationProvider + ErrorBoundary)
Direct hook usage: useInstallation(), useCreateInstallation()
Clear data flow from hooks to components
```

## File Structure

```
src/components/Configure/
├── InstallIntegrationV2.tsx              # New main component
├── content/
│   └── InstallationContentV2.tsx         # New content component using hooks
└── ai/                                    # NEW: AI-enhanced components
    ├── SmartFieldSuggest.tsx             # Smart field mapping suggestions
    ├── ContextualHelp.tsx                # Help tooltips and panels
    ├── index.ts                          # Exports
    └── utils/
        └── smartSuggestions.ts           # AI logic (pattern matching)

.claude/context/                           # Documentation for Claude Code
├── install-integration-migration.md      # Current architecture analysis
├── MIGRATION_PLAN.md                     # Implementation roadmap
├── V2_USAGE_GUIDE.md                     # How to use V2
└── BRANCH_README.md                      # This file
```

## Key Features

### 1. Headless Architecture

**Before:**
```tsx
const { installation, integrationObj } = useInstallIntegrationProps(); // From context
```

**After:**
```tsx
const { installation } = useInstallation(); // From hook
const { data: integrationObj } = useIntegrationQuery(integrationNameOrId);
```

### 2. Smart Field Suggestions

AI analyzes field names and suggests mappings:

- **Pattern matching**: Recognizes common field types (email, firstName, phone, etc.)
- **Similarity scoring**: Fuzzy matching for field names
- **Confidence levels**: Visual indicators for match quality
- **One-click apply**: Accept suggestions with a single click

### 3. Contextual Help

Every field can have:
- Tooltip help on hover
- Panel-style expanded help
- Examples for common fields
- Smart error messages with recovery suggestions

### 4. Client-Side AI

All AI features run **client-side** with no external API calls:
- Pattern recognition
- Levenshtein distance for fuzzy matching
- Field relationship detection
- Error message analysis

## What's Next?

### Immediate Next Steps
1. **Test the V2 component** in a real integration flow
2. **Iterate on AI suggestions** based on real data
3. **Add more field patterns** to improve suggestions
4. **Build example integrations** using V2

### Future Enhancements
1. **Progressive disclosure** - AI determines which fields to show
2. **Sidebar chat** - Conversational AI assistant (more ambitious)
3. **Smart validation** - Predict validation errors before submission
4. **Learning system** - Remember user preferences (requires backend)

## Testing V2

### Manual Testing Checklist
- [ ] Load V2 component with different integrations
- [ ] Test smart suggestions with various field names
- [ ] Verify contextual help appears correctly
- [ ] Test create installation flow
- [ ] Test update installation flow
- [ ] Check error handling and error help

### Integration Testing
- [ ] V2 works alongside V1 without conflicts
- [ ] Headless hooks return correct data
- [ ] AI suggestions are accurate
- [ ] Performance is acceptable

## Documentation

All docs are in `.claude/context/`:

1. **install-integration-migration.md** - Understand current V1 architecture
2. **MIGRATION_PLAN.md** - Full implementation plan and roadmap
3. **V2_USAGE_GUIDE.md** - Complete usage guide with examples
4. **BRANCH_README.md** - This file (quick overview)

## Important Notes

### V1 vs V2
- **V1 still works** - This is experimental, not a replacement yet
- **V1 and V2 can coexist** - Use V2 for new features, keep V1 stable
- **V2 uses V1 child components** - CreateInstallation/UpdateInstallation work with both

### AI Limitations
- **Client-side only** - No server-side AI (yet)
- **Pattern-based** - Not truly "learning" (heuristics only)
- **English names** - Best with English field names
- **Common patterns** - Works best with standard field types

### Breaking Changes
None! V2 is a new component, not a refactor of V1.

## Questions?

See the documentation in `.claude/context/` or:
- Check `V2_USAGE_GUIDE.md` for usage examples
- Check `MIGRATION_PLAN.md` for implementation details
- Check `install-integration-migration.md` for architecture info

## Contributing

When continuing work on this branch:

1. Read the context docs in `.claude/context/`
2. Update `MIGRATION_PLAN.md` with progress
3. Add new AI patterns to `smartSuggestions.ts`
4. Document new features in `V2_USAGE_GUIDE.md`

## Summary

This branch successfully implements:
- ✅ Simplified headless architecture
- ✅ AI-powered field suggestions
- ✅ Contextual help system
- ✅ Full documentation
- ✅ Example usage patterns

**Ready for testing and iteration!**
