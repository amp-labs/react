import { produce } from "immer";
import type { FieldMapping } from "src/components/Configure/InstallIntegration";
import type { InstallationConfigContent } from "src/headless/config/types";

/**
 * Returns a copy of the config draft with stale value mappings pruned.
 *
 * Value mappings are stored keyed by the resolved provider field name. When the
 * user re-maps a field (or the field becomes unresolved), the picks under the
 * old field name become orphans. Rather than eagerly clearing them on every
 * field-mapping edit (which would lose the user's work if they toggle back), we
 * keep them in the draft and derive the effective config here, at submit time:
 * only `selectedValueMappings[field]` entries whose field is currently resolved
 * by a value-mapping unit (a `fieldMapping` prop entry with `mappedValues`) are
 * kept.
 */
export function buildSubmissionConfig(
  config: InstallationConfigContent,
  fieldMapping?: FieldMapping,
): InstallationConfigContent {
  const objects = config.read?.objects;
  if (!objects) return config;

  return produce(config, (draft) => {
    const draftObjects = draft.read?.objects;
    if (!draftObjects) return;

    Object.entries(draftObjects).forEach(([objectName, obj]) => {
      const selectedValueMappings = obj.selectedValueMappings;
      if (!selectedValueMappings) return;

      // Provider fields currently targeted by a value-mapping unit.
      const resolvedFields = new Set<string>();
      (fieldMapping?.[objectName] ?? []).forEach((entry) => {
        if (!entry.mappedValues?.length) return;
        const field = entry.mapToName
          ? obj.selectedFieldMappings?.[entry.mapToName]
          : entry.fieldName;
        if (field) resolvedFields.add(field);
      });

      Object.keys(selectedValueMappings).forEach((field) => {
        if (!resolvedFields.has(field)) {
          delete selectedValueMappings[field];
        }
      });

      if (Object.keys(selectedValueMappings).length === 0) {
        delete obj.selectedValueMappings;
      }
    });
  });
}
