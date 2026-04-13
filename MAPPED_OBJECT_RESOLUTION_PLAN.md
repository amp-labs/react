# Plan: Mapped-Object Resolution in InstallWizard

## Context

Today, every `read.objects[]` entry in `amp.yaml` ships with a concrete `objectName`. We are adding support for a new authoring pattern where an object is declared with only `mapToName` / `mapToDisplayName` and **no `objectName`**. In that case, the integrating customer must tell the UI which provider-side object should fulfill that mapping.

When the wizard encounters such an "unresolved mapped object":

1. UI prompts: *"Which object represents `{mapToDisplayName}`?"*
2. User types e.g. `contacts` and submits.
3. UI calls `ObjectsFieldsApi.getObjectMetadataForConnection` to fetch field metadata for that provider object.
4. API error → inline error + retry. API success → the object is treated as fully resolved and the normal field-configuration flow continues.

Decisions already made:
- Resolution happens **per-object inside `ConfigureObjectsStep`** (not up-front).
- Users can **edit** the resolved name before install.
- Re-entering an existing Installation whose `Installation.config` already has an `objectName` for this manifest entry **skips** the resolve sub-page.

## Design principle: resolve-then-hydrate

Resolution is a **one-way adapter at the manifest boundary**, not a status flag threaded through state. The moment the user resolves an object:

1. The draft config stores the entry keyed by the user-chosen `objectName`, with `objectName` set on the object — exactly like any normal object. `createInstallation` then persists `objectName` for free (`ReviewStep.tsx:97`, `useConfigHelper.tsx:102`).
2. A `useManifest` merge step substitutes the unresolved `HydratedIntegrationObject` with a fully-formed one (real `objectName`, `requiredFields`/`optionalFields`/`allFieldsMetadata` from the API response).

Every downstream consumer — object tabs, field pickers, mapping UI, install mutation, `ReviewStep` — keeps seeing a normal object shape. No keying dance, no payload swap, no reducer plumbing.

## Approach

### 1. New query hook
New file `src/hooks/query/useObjectMetadataForConnectionQuery.ts`:
- Wraps `ObjectsFieldsApi.getObjectMetadataForConnection(projectIdOrName, provider, providerObjectName, groupRef?, excludeReadOnly?)` → `ObjectMetadata`.
- Query key: `["amp", "objectMetadataForConnection", projectIdOrName, provider, providerObjectName, groupRef]`.
- `enabled`: requires all of `projectIdOrName`, `provider`, `providerObjectName` truthy; caller passes an additional `enabled` flag so fetch only fires after submit.
- `staleTime: Infinity`; expose `refetch` for retry.

### 2. Resolutions store
New small context `src/components/InstallWizard/state/ResolvedMappedObjectsProvider.tsx`:
- Holds a `Map<mapToName, { resolvedObjectName: string; metadata: ObjectMetadata }>`.
- Exposes `getResolution(mapToName)`, `setResolution(mapToName, payload)`, `clearResolution(mapToName)`.
- Mounted inside the wizard tree near `ConfigurationStateProvider`.
- Seeded once on mount from an existing `Installation.config` (see §6).

### 3. Manifest merge
In `src/headless/manifest/useManifest.ts` and `src/utils/manifest.ts`:
- Add predicate `isUnresolvedReadObject(obj)` → `!obj.objectName && !!obj.mapToName`.
- In `useManifest`, pull resolutions from `ResolvedMappedObjectsProvider`. Build a derived revision where each unresolved read object is replaced (if a resolution exists) with:
  ```ts
  {
    ...obj,
    objectName: resolution.resolvedObjectName,
    requiredFields: toRequiredFields(resolution.metadata),
    optionalFields: toOptionalFields(resolution.metadata),
    allFieldsMetadata: resolution.metadata.fields,
  }
  ```
  Helpers (`toRequiredFields` / `toOptionalFields`) respect the manifest's declared required/optional field names if present; otherwise everything returned by `getObjectMetadataForConnection` is treated as optional.
- `getReadObjects()` returns resolved + still-unresolved objects (stable order preserved).
- `getReadObject(name)` matches on the now-resolved `objectName`; for still-unresolved objects it matches on `mapToName` (the only stable key available).
- `getCustomerFieldsForObject(name)` returns `{}` for still-unresolved objects.
- **No changes** to how resolved objects behave downstream.

### 4. Resolve sub-page component
New file `src/components/InstallWizard/steps/configure-objects/resolve/ResolveMappedObjectSubPage.tsx`:
- Props: `mapToName`, `mapToDisplayName`, `initialValue?`, `onResolved()`.
- Local `draftName` state; separate `submittedName` state feeds `useObjectMetadataForConnectionQuery({ enabled: !!submittedName })`.
- Uses `FormControl` + `Input` from `src/components/form/`; inline error via `isInvalid` + `errorMessage: error?.message`.
- Submit button disabled while `draftName` empty or `isFetching`.
- On `query.data` success: call `setResolution(mapToName, { resolvedObjectName: submittedName, metadata: data })`, then `onResolved()`.

### 5. Wizard wiring
`src/components/InstallWizard/steps/configure-objects/ConfigureObjectsStep.tsx` — gate before line 143:
```ts
const currentObject = currentManifestObject?.object;
const needsResolution = currentObject && isUnresolvedReadObject(currentObject);
if (needsResolution) {
  return (
    <ResolveMappedObjectSubPage
      mapToName={currentObject.mapToName!}
      mapToDisplayName={currentObject.mapToDisplayName ?? currentObject.mapToName!}
      onResolved={() => {/* no-op; manifest merge triggers rerender */}}
    />
  );
}
```
Because the manifest merge rewrites the object as soon as `setResolution` runs, the next render of `ConfigureObjectsStep` sees a resolved object and falls through into `FieldsContent` / `MappingsContent` / `AdditionalFieldsContent` naturally. `useSubPageNavigation` needs no changes.

`src/components/InstallWizard/steps/configure-objects/ObjectTabs.tsx`:
- For currently-unresolved objects, render the tab label using `mapToDisplayName` and append a subtle "Needs setup" badge.
- For resolved objects, add a small **Edit** affordance in the sub-page header (inside `ResolveMappedObjectSubPage` render path) that calls `clearResolution(mapToName)` to return to the resolve UI. Keyed off the presence of a resolution in the store.

### 6. SelectObjectsStep
`src/components/InstallWizard/steps/SelectObjectsStep.tsx`:
- Include unresolved objects in the list, labelled by `mapToDisplayName`, with the same "Needs setup" badge.
- Selection works normally; resolution is deferred to `ConfigureObjectsStep`.
- `selectedObjects` in wizard state must key off a stable identifier — since resolved objects key by `objectName` and unresolved by `mapToName`, use `objectName ?? mapToName` as the `selectedObjects` value. After resolution the same entry still appears in `selectedObjects` (via the resolved `objectName`) because the resolved object adopts the user-chosen name; confirm this holds in `SelectObjectsStep` by seeding selection with the resolved name once resolution lands.

### 7. Rehydration from existing Installation
Inside `ResolvedMappedObjectsProvider` on mount:
- Read the raw (unmerged) manifest via a thin selector.
- For each unresolved manifest object, scan `installation?.config.content.read.objects` for an entry whose `objectName` is present but has no matching manifest `objectName`. If found, seed a resolution entry `{ mapToName, resolvedObjectName: objectName, metadata: <fetched lazily> }`.
- Metadata for rehydrated entries is fetched on-demand the first time the user lands on that object's tab (same hook, triggered with `enabled: true` and the stored `resolvedObjectName`). Until metadata arrives, show a lightweight loader in the tab; the resolve sub-page does not reappear.

### 8. Install-mutation payload
**No changes required.** The draft is already keyed and populated by `objectName` (`src/headless/config/useConfigHelper.tsx:94-128`), and `ReviewStep` submits `localConfig.draft` (`src/components/InstallWizard/steps/ReviewStep.tsx:97-98`). Since resolved objects appear in the manifest with a real `objectName`, the existing `initializeObjectWithDefaults` path fills in the draft correctly.

## Critical files

- `src/hooks/query/useObjectMetadataForConnectionQuery.ts` *(new)*
- `src/components/InstallWizard/state/ResolvedMappedObjectsProvider.tsx` *(new)*
- `src/utils/manifest.ts`
- `src/headless/manifest/useManifest.ts`
- `src/components/InstallWizard/steps/configure-objects/ConfigureObjectsStep.tsx`
- `src/components/InstallWizard/steps/configure-objects/ObjectTabs.tsx`
- `src/components/InstallWizard/steps/configure-objects/resolve/ResolveMappedObjectSubPage.tsx` *(new)*
- `src/components/InstallWizard/steps/SelectObjectsStep.tsx`

## Reused primitives

- `ObjectsFieldsApi.getObjectMetadataForConnection` (`generated-sources/api/src/apis/ObjectsFieldsApi.ts:87`)
- `FormControl` (`src/components/form/FormControl/index.tsx:56`) + `Input` (`src/components/form/Input/index.tsx`)
- `useProjectQuery`, `useProvider`, `useInstallIntegrationProps` for query hook inputs
- Existing `useSubPageNavigation`, `FieldsContent`, `MappingsContent`, `AdditionalFieldsContent` — **no changes**
- Existing `useConfigHelper` draft plumbing — **no changes**

## Backend dependencies (confirm before implementation)

- `HydratedIntegrationObject` may return with missing/empty `objectName` and present `mapToName`. The TypeScript model currently marks `objectName` as required; either relax to `objectName?: string` in the generated model (after backend OpenAPI regen) or handle runtime-optional via a narrow cast.
- `Installation.config.read.objects[<resolvedName>]` with a user-chosen `objectName` not present in the manifest must be accepted on create and echoed back on read.

## Verification

- **Unit**: `useObjectMetadataForConnectionQuery` gating + error propagation (React Query test harness). Manifest helpers: `isUnresolvedReadObject`, `getReadObjects` returns merged view, `getReadObject` matches by `mapToName` pre-resolution and by `objectName` post-resolution.
- **Component**: RTL on `ResolveMappedObjectSubPage` — loading, API error, success → `setResolution` called and `FieldsContent` renders on next tick. RTL on `ConfigureObjectsStep` gate with a fixture manifest containing a `mapToName`-only object.
- **Manual / dev harness**: amp.yaml fixture with a `mapToName`-only read object. Scenarios:
  1. Happy path: submit name → fields appear.
  2. API 4xx: error message, retry succeeds.
  3. Empty input: submit disabled.
  4. Edit: click Edit → resolve sub-page reappears → change name → fields refresh with new metadata.
  5. Rehydration: install once, close wizard, reopen → resolved object's tab opens directly to `FieldsContent` (no resolve sub-page).
  6. Install payload: `Installation.config.read.objects` contains the resolved `objectName`, not the `mapToName`.
- Run `yarn lint` and `yarn test`.
