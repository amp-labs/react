# InstallIntegration Headless Migration - Implementation Plan

## Goal
Create a new experimental `InstallIntegration` component that:
1. Uses headless hooks for state management (removing legacy context provider)
2. Incorporates AI to improve UX and reduce setup complexity
3. Provides smarter, more guided user experience

## Migration Strategy

### Phase 1: Create New Experimental Component (Recommended Starting Point)

Rather than refactoring the existing component, we'll create a new experimental version alongside it:

**Create**: `src/components/Configure/InstallIntegrationV2.tsx`

This approach allows:
- Safe experimentation without breaking existing implementation
- Side-by-side comparison
- Gradual adoption by users
- Easy rollback if needed

### Phase 2: Simplify Provider Architecture

#### Current (10+ nested providers)
```tsx
InstallIntegration
└── InstallIntegrationErrorBoundary
    └── InstallationProvider (headless)
        └── InstallIntegrationContent
            └── InstallIntegrationProvider (REMOVE THIS)
                └── ConnectionsProvider
                    └── ProtectedConnectionLayout
                        └── HydratedRevisionProvider
                            └── ConditionalHasConfigurationLayout
                                └── ConfigurationProvider
                                    └── ObjectManagementNav
                                        └── InstallationContent
```

#### Target (simplified)
```tsx
InstallIntegrationV2
└── InstallIntegrationErrorBoundary
    └── InstallationProvider (headless - provides context)
        └── ConnectionsProvider (keep if needed for connections)
            └── InstallationContentV2 (uses hooks directly)
                └── Smart AI assistant components
```

**Key Changes:**
1. **Remove** `InstallIntegrationProvider` - replace with headless hooks
2. **Simplify or remove** intermediate layout providers
3. **Keep** `InstallationProvider` (already headless-friendly)
4. **Add** AI assistance layer

### Phase 3: Component Refactoring

#### Step 1: Create Headless-First Main Component

**File**: `src/components/Configure/InstallIntegrationV2.tsx`

```tsx
import { InstallationProvider, useInstallation, useCreateInstallation, useUpdateInstallation } from 'src/headless';

interface InstallIntegrationV2Props {
  integration: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  onInstallSuccess?: (installationId: string, config: Config) => void;
  onUpdateSuccess?: (installationId: string, config: Config) => void;
  onUninstallSuccess?: (installationId: string) => void;
}

export function InstallIntegrationV2(props: InstallIntegrationV2Props) {
  return (
    <InstallIntegrationErrorBoundary>
      <InstallationProvider
        integration={props.integration}
        consumerRef={props.consumerRef}
        consumerName={props.consumerName}
        groupRef={props.groupRef}
        groupName={props.groupName}
      >
        <InstallationContentV2 {...props} />
      </InstallationProvider>
    </InstallIntegrationErrorBoundary>
  );
}

// Internal component that uses hooks
function InstallationContentV2({ onInstallSuccess, onUpdateSuccess, onUninstallSuccess }) {
  // Use headless hooks directly
  const { installation, isPending, isError } = useInstallation();
  const { createInstallation, isPending: isCreating } = useCreateInstallation();
  const { updateInstallation, isPending: isUpdating } = useUpdateInstallation();

  // Component logic using hooks...
}
```

**Benefits:**
- No complex context provider needed
- Hooks handle all data fetching and mutations
- Clear separation of concerns
- Easy to test

#### Step 2: Create Smart Component Variants

Create enhanced versions of key child components:

**New Files:**
- `src/components/Configure/content/InstallationContentV2.tsx` - Main content with hooks
- `src/components/Configure/content/CreateInstallationV2.tsx` - Simplified with AI help
- `src/components/Configure/content/UpdateInstallationV2.tsx` - Simplified with AI help

**Replace Legacy Context Usage:**
```tsx
// OLD - using context
const { installation, integrationObj } = useInstallIntegrationProps();

// NEW - using hooks
const { installation, isPending } = useInstallation();
const { data: integrationObj } = useIntegrationQuery(integrationNameOrId);
```

### Phase 4: AI-Enhanced UX Features

#### Option A: Sidebar Chat Assistant

**File**: `src/components/Configure/ai/InstallationAssistant.tsx`

Features:
- Contextual help based on current step
- Field suggestion and explanation
- Error resolution guidance
- Natural language config input

**Integration Pattern:**
```tsx
<div className="installation-layout">
  <div className="main-content">
    <InstallationContentV2 />
  </div>
  <div className="sidebar">
    <InstallationAssistant
      context={{
        installation,
        integration,
        currentStep,
        errors
      }}
    />
  </div>
</div>
```

#### Option B: Smart Assist Button/Tooltip

**File**: `src/components/Configure/ai/SmartAssist.tsx`

Features:
- Inline contextual help
- Click to get AI suggestions
- Smart field auto-fill
- Minimal UI footprint

**Integration Pattern:**
```tsx
<FieldInput
  name="apiKey"
  label="API Key"
  smartAssist={{
    suggestions: true,
    validation: true,
    help: "How do I find my API key?"
  }}
/>
```

#### Option C: Progressive Disclosure with AI

Simplify the initial UI by:
1. Show only essential fields first
2. AI determines which advanced fields are relevant
3. Progressive reveal based on user's integration needs
4. Smart defaults based on common patterns

**Example:**
```tsx
<SmartConfigForm
  integration={integration}
  onAIAnalysis={(recommendations) => {
    // AI suggests which fields to show
    // AI provides smart defaults
    // AI warns about common mistakes
  }}
/>
```

### Phase 5: AI Implementation Approaches

#### Approach 1: Client-Side AI (Lightweight)
- Use pattern matching and heuristics
- Rule-based suggestions
- No external API calls
- Fast, privacy-friendly

#### Approach 2: Server-Side AI (Advanced)
- Integration with OpenAI/Claude API
- Context-aware suggestions
- Learning from past configurations
- Requires backend support

#### Approach 3: Hybrid
- Client-side for simple suggestions
- Server-side for complex analysis
- Graceful degradation

**Recommended Starting Point:** Approach 1 (Client-Side)
- Analyze integration manifest
- Common field patterns
- Validation error suggestions
- Field relationship hints

### Phase 6: Implementation Steps

#### Step 6.1: Setup (Current - Completed)
- [x] Create branch
- [x] Document current architecture
- [x] Create migration plan

#### Step 6.2: Core Component Migration
- [x] Create `InstallIntegrationV2.tsx` with basic structure
- [x] Implement main component using headless hooks
- [x] Remove dependency on `InstallIntegrationProvider`
- [x] Implement basic auth flow with `ProtectedInstallationContent`
- [ ] Test basic install/update/delete flows (update flow pending)

#### Step 6.3: Child Component Refactor
- [x] Create `InstallationContentV2.tsx`
- [x] Create multi-step `CreateInstallationWizard`
- [x] Create `ConfigureObjectStep` for field selection
- [x] Use `useLocalConfig()` for draft state management
- [x] Update error handling to use error boundary
- [ ] Simplify layout components (ongoing)

#### Step 6.4: AI Assistant - Basic (Start Here for AI)
- [x] Create `SmartFieldSuggest.tsx` - Client-side field suggestions
- [x] Implement manifest analysis for smart defaults (1000+ line AI engine)
- [x] Add contextual help tooltips (`ContextualHelp.tsx`)
- [x] Pattern-based field validation suggestions (11+ field types)

#### Step 6.5: AI Assistant - Enhanced
- [ ] Create sidebar chat component (if desired)
- [ ] Implement progressive disclosure logic
- [ ] Add smart error recovery suggestions
- [ ] Field relationship detection

#### Step 6.6: Testing & Refinement
- [ ] Unit tests for V2 components
- [ ] Integration tests with headless hooks
- [ ] User testing with AI features
- [ ] Performance comparison with V1

#### Step 6.7: Documentation
- [ ] API documentation for V2
- [ ] Migration guide for users
- [ ] AI feature documentation
- [ ] Component examples

## Recommended Starting Tasks

### Option 1: Focus on Headless Migration First
1. Create `InstallIntegrationV2.tsx` basic structure
2. Migrate to use `useInstallation()` hook
3. Implement create/update flows with hooks
4. Get it working without AI first

### Option 2: Focus on AI Prototype First
1. Create a standalone AI assistant component
2. Implement smart field suggestions
3. Build contextual help system
4. Integrate with existing V1 component

### Option 3: Parallel Development (Recommended)
1. **Track 1 (Architectural)**: Build V2 component with hooks
2. **Track 2 (AI/UX)**: Build AI assistant as standalone module
3. **Integration**: Combine both when ready

## Success Criteria

### Headless Migration
- [ ] Zero usage of `InstallIntegrationProvider` in V2
- [ ] All state from headless hooks
- [ ] Fewer than 5 nested providers
- [ ] Same functionality as V1

### AI Enhancement
- [ ] Reduces setup clicks by 30%+
- [ ] Smart suggestions for common fields
- [ ] Contextual help always available
- [ ] Error recovery suggestions

### Developer Experience
- [ ] Clear documentation
- [ ] Easy to extend
- [ ] Type-safe
- [ ] Testable components

## Rollout Strategy

1. **Alpha**: Use V2 in development/testing
2. **Beta**: Opt-in flag for V2 component
3. **Gradual**: Default to V2, fallback to V1
4. **Deprecation**: Mark V1 as deprecated
5. **Removal**: Remove V1 after migration period

## Questions to Answer

1. **AI Backend**: Do we need server-side AI or start with client-side?
2. **UI Pattern**: Sidebar chat vs inline assist vs both?
3. **Migration Timeline**: Big bang or gradual?
4. **Backward Compatibility**: Support both V1 and V2?
5. **AI Features Priority**: Which AI features deliver most value?

## Next Steps

Based on your preference, we can:

**Path A: Start with headless architecture refactor**
- Create basic V2 component structure
- Migrate to hooks
- Get feature parity with V1

**Path B: Start with AI prototype**
- Design AI assistant UI
- Implement smart suggestions
- Build contextual help system

**Path C: Hybrid approach**
- Basic V2 structure + simple AI features
- Iterate on both simultaneously

Which path would you like to take?
