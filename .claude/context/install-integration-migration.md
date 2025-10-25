# InstallIntegration Headless Migration - Context Document

## Branch
`feat/install-integration-headless-migration`

## Overview
This document provides context for migrating the InstallIntegration component to use headless hooks architecture with AI-enhanced UX improvements.

## Current Architecture

### Main Component
- **File**: `src/components/Configure/InstallIntegration.tsx`
- **Entry Point**: `InstallIntegration` component (lines 145-187)

### Current State Management
The component currently uses a **Context Provider** pattern with multiple nested providers:

1. **InstallIntegrationProvider** (`src/context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider.tsx`)
   - Manages: integration object, installation data, callbacks
   - Queries: `useListInstallationsQuery`, `useListIntegrationsQuery`
   - Provides: `useInstallIntegrationProps()` hook
   - Heavy responsibility: Error handling, query management, cache updates

2. **InstallationProvider** (headless) - Already exists at `src/headless/InstallationProvider.tsx`
   - Lightweight provider for basic context (integration, consumer, group refs)
   - Already wrapping the component (line 176)
   - Only provides basic props, no business logic

### Provider Nesting
```
InstallIntegration (root)
└── InstallIntegrationErrorBoundary
    └── InstallationProvider (headless - already added)
        └── InstallIntegrationContent
            └── InstallIntegrationProvider (legacy context)
                └── ConnectionsProvider
                    └── ProtectedConnectionLayout
                        └── HydratedRevisionProvider
                            └── ConditionalHasConfigurationLayout
                                └── ConfigurationProvider
                                    └── ObjectManagementNav
                                        └── InstallationContent
```

## Existing Headless Hooks

The codebase already has a complete set of headless hooks in `src/headless/`:

### Installation Hooks
- **`useInstallation()`** - Get installation data and query states
  - Returns: `{ installation, isPending, isFetching, isError, isSuccess, error }`

- **`useCreateInstallation()`** - Create new installation
  - Returns: `{ createInstallation, isIdle, isPending, error, errorMsg }`
  - Handles: Config validation, connection linking, query invalidation

- **`useUpdateInstallation()`** - Update existing installation
  - Returns: `{ updateInstallation, isIdle, isPending, error, errorMsg }`
  - Handles: Update masks, config merging, query invalidation

- **`useDeleteInstallation()`** - Delete installation
  - Returns: `{ deleteInstallation, isIdle, isPending, error, errorMsg }`

### Other Headless Hooks
- **`useConnection()`** - Get connection data
- **`useManifest()`** - Get manifest data
- **`useConfig()` / `useLocalConfig()`** - Config management

### Provider Structure
- `InstallationProvider` - Context provider for integration/consumer/group refs
- `ConfigProvider` - Config state management (nested inside InstallationProvider)

## Current Pain Points

1. **Multiple Sources of Truth**
   - Legacy `InstallIntegrationProvider` duplicates functionality that exists in headless hooks
   - Two parallel state management systems (context + headless)
   - Confusion about which to use where

2. **Deep Provider Nesting**
   - 10+ levels of nested providers
   - Difficult to trace data flow
   - Performance implications from multiple re-renders

3. **Tight Coupling**
   - UI components tightly coupled to specific context structure
   - Hard to reuse components outside the full provider tree
   - Testing requires extensive mocking

4. **Complex Setup**
   - Developers need to understand the entire provider hierarchy
   - Easy to miss required providers when using components
   - No clear separation between data fetching and UI logic

5. **Error Handling Spread Across Layers**
   - Error boundary at top level
   - Error state in `InstallIntegrationProvider`
   - Query errors in individual components
   - Inconsistent error messaging

## Migration Goals

1. **Use Headless Hooks**
   - Replace `InstallIntegrationProvider` with headless hooks
   - Components use `useInstallation()`, `useCreateInstallation()`, etc. directly
   - Flatten provider hierarchy

2. **AI-Enhanced UX**
   - Smart field suggestions based on context
   - Intelligent error recovery
   - Contextual help and guidance
   - Predictive field mapping

3. **Simplify Developer Experience**
   - Clear separation: data (hooks) vs UI (components)
   - Minimal required providers
   - Self-documenting API
   - Better TypeScript support

4. **UI Patterns to Explore**
   - Sidebar chat for AI assistance
   - Smart assist button for contextual help
   - Inline AI suggestions
   - Progressive disclosure of complex options

## Key Files Reference

### Current Implementation
- `src/components/Configure/InstallIntegration.tsx` - Main component
- `src/context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider.tsx` - Legacy provider
- `src/components/Configure/content/InstallationContent.tsx` - Main content component

### Headless Infrastructure (Already Built)
- `src/headless/index.ts` - Exports all headless hooks
- `src/headless/InstallationProvider.tsx` - Lightweight provider
- `src/headless/installation/useInstallation.ts` - Get installation
- `src/headless/installation/useCreateInstallation.ts` - Create installation
- `src/headless/installation/useUpdateInstallation.ts` - Update installation
- `src/headless/installation/useDeleteInstallation.ts` - Delete installation
- `src/headless/useConnection.ts` - Connection management
- `src/headless/config/ConfigContext.tsx` - Config helpers

### Child Components to Refactor
- `src/components/Configure/content/CreateInstallation.tsx`
- `src/components/Configure/content/UpdateInstallation.tsx`
- `src/components/Configure/content/InstallationContent.tsx`
- Various field mapping components

## Next Steps
See `MIGRATION_PLAN.md` for detailed implementation steps.
