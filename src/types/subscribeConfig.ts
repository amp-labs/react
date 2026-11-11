import type { SubscribeConfigObject } from "@generated/api/src";
import { ConfigUpdateEventWatchFieldsAutoEnum } from "@generated/api/src";

/**
 * One object's subscribe config, in the installation API's shape. The key it is passed under
 * supplies `objectName`, and `destination` is optional: when omitted, the server takes the
 * destination from the object's `amp.yaml` subscribe object.
 *
 * @experimental
 */
export type SubscribeObjectConfig = Omit<
  SubscribeConfigObject,
  "objectName" | "destination"
> & { destination?: string };

/**
 * Subscribe config per object name, written to `config.content.subscribe.objects` when the
 * install wizard creates the installation, e.g.
 * `{ messages: { inheritFieldsAndMappings: false, createEvent: { enabled: "always" } } }`.
 *
 * @experimental
 */
export type SubscribeConfigByObject = Record<string, SubscribeObjectConfig>;

/** How an update event says which field changes it wants to be told about. */
export type UpdateEventWatchSpec =
  | { requiredWatchFields: string[] }
  | { watchFieldsAuto: ConfigUpdateEventWatchFieldsAutoEnum };

/**
 * Lists the field names a non-inheriting subscribe object's config names: `selectedFields`
 * set to true and the mapped names in `selectedFieldMappings`, each once. Leaves out
 * `updateEvent.requiredWatchFields`: they decide which changes fire an update event and are
 * not delivered unless `selectedFields` or `selectedFieldMappings` also lists them.
 */
export function namedFields(object: SubscribeObjectConfig): string[] {
  return [
    ...new Set([
      ...Object.entries(object.selectedFields ?? {})
        .filter(([, selected]) => selected)
        .map(([name]) => name),
      ...Object.keys(object.selectedFieldMappings ?? {}),
    ]),
  ];
}
