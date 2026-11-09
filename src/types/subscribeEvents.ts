import { ConfigUpdateEventWatchFieldsAutoEnum } from "@generated/api/src";

/**
 * A create or delete event. Its presence subscribes the object to that event; it takes no
 * options yet. The consumer is not asked about it: there is no wizard step for choosing
 * subscribe events.
 *
 * @experimental
 */
export type SubscribeEventOption = Record<string, never>;

/**
 * An update event. Its presence subscribes the object to updates, watching the fields in
 * `requiredWatchFields`; an inheriting object that names none watches every field
 * (`watchFieldsAuto: "all"`). With `enabled: false` it is written as `never`, so no update
 * events are delivered.
 *
 * @experimental
 */
export interface SubscribeUpdateEventOption {
  /**
   * Provider field names whose changes trigger an update event.
   *
   * For an object with `inheritFieldsAndMappings: false` they are also the fields every event
   * delivers, and they are required: the object does not take fields from a read config, and
   * the server rejects it when it names none. For an inheriting object they are optional;
   * naming none watches every field, and events deliver the read config's fields.
   *
   * There is no field metadata for subscribe objects, so these are taken as written and not
   * validated against the provider.
   */
  requiredWatchFields?: string[];
  /**
   * Whether update events are delivered. Defaults to `true`.
   *
   * `false` installs the object without update events: the update event is written as
   * `never`. On a non-inheriting object, `requiredWatchFields` is still the list of fields the
   * create and delete events deliver. It is how a subscribe-only object that wants no updates
   * names its fields, since `requiredWatchFields` is the only field list these props take.
   */
  enabled?: boolean;
}

/**
 * An update event that names the fields it watches, as a non-inheriting object's must.
 *
 * @experimental
 */
export interface SubscribeUpdateEventWithFields
  extends SubscribeUpdateEventOption {
  requiredWatchFields: string[];
}

/**
 * The events common to both kinds of object.
 *
 * Which fields an object cares about is said once, as `requiredWatchFields` on the update
 * event. The config schema also has `selectedFields` and `selectedFieldMappings`; these props
 * don't take them, because they cover only what the caller decides without asking the
 * consumer. The server accepts all three, and `useConfigHelper`'s `subscribeObject()` has
 * `setSelectedFields` and `setSelectedFieldMappings` for a step that asks the consumer.
 */
interface SubscribeEventsBase {
  createEvent?: SubscribeEventOption;
  deleteEvent?: SubscribeEventOption;
}

/**
 * An object that takes its fields and mappings from the matching read object.
 *
 * @experimental
 */
export interface InheritingSubscribeEvents extends SubscribeEventsBase {
  inheritFieldsAndMappings: true;
  updateEvent?: SubscribeUpdateEventOption;
}

/**
 * An object that does not inherit from a read object, such as a subscribe-only object. Its
 * fields are `updateEvent.requiredWatchFields`, so `updateEvent` is required; set
 * `updateEvent.enabled: false` to install it without update events.
 *
 * @experimental
 */
export interface NonInheritingSubscribeEvents extends SubscribeEventsBase {
  inheritFieldsAndMappings: false;
  updateEvent: SubscribeUpdateEventWithFields;
}

/**
 * Subscribe behaviour per event type, keyed the same way the installation config is.
 * An omitted event is left out of the config, so the manifest decides whether it is subscribed.
 *
 * `inheritFieldsAndMappings` is required, with no default: when the config leaves it out, the
 * server takes the manifest's `inheritFieldsAndMapping` for the object, or inherits when the
 * manifest has no matching subscribe object. Say which it is rather than leave the object's
 * shape to the manifest.
 *
 * `false` for a subscribe-only object, which is the only value that works: it has no read
 * object behind it, and an inheriting object with none is rejected with "read object config
 * is required to subscribe object". `true` for an object that does have a read action, whose
 * fields it then takes.
 *
 * @experimental
 */
export type SubscribeEvents =
  | InheritingSubscribeEvents
  | NonInheritingSubscribeEvents;

/**
 * Subscribe props per object name, e.g.
 * `{ messages: { inheritFieldsAndMappings: false, updateEvent: { requiredWatchFields: ["text"] } } }`.
 *
 * @experimental
 */
export type SubscribeEventsByObject = Record<string, SubscribeEvents>;

/** One event to configure without asking the consumer. */
export interface AutoAppliedSubscribeEvent {
  objectName: string;
  event: "createEvent" | "updateEvent" | "deleteEvent";
}

/**
 * Lists the events the wizard writes for each object: every event whose key is present. An
 * absent key leaves that event out of the config.
 */
export function autoAppliedSubscribeEvents(
  subscribeEvents: SubscribeEventsByObject | undefined,
): AutoAppliedSubscribeEvent[] {
  if (!subscribeEvents) return [];

  const events: AutoAppliedSubscribeEvent[] = [];
  const eventKeys = ["createEvent", "updateEvent", "deleteEvent"] as const;

  Object.entries(subscribeEvents).forEach(([objectName, perObject]) => {
    eventKeys.forEach((event) => {
      if (perObject[event]) events.push({ objectName, event });
    });
  });

  return events;
}

/** How an update event says which field changes it wants to be told about. */
export type UpdateEventWatchSpec =
  | { requiredWatchFields: string[] }
  | { watchFieldsAuto: ConfigUpdateEventWatchFieldsAutoEnum };

/**
 * How an update event decides what to watch.
 *
 * The named fields if there are any, and every field otherwise. A config update event is
 * rejected unless it carries `requiredWatchFields` or `watchFieldsAuto`, and `watchFieldsAuto`
 * has one value in a config, `"all"`. Every field is only valid for an inheriting object: the
 * server rejects a non-inheriting object that names none, which the types rule out except for
 * an empty `requiredWatchFields`.
 */
export function updateEventWatchSpec(
  updateEvent: SubscribeUpdateEventOption | undefined,
): UpdateEventWatchSpec {
  return updateEvent?.requiredWatchFields?.length
    ? { requiredWatchFields: updateEvent.requiredWatchFields }
    : { watchFieldsAuto: ConfigUpdateEventWatchFieldsAutoEnum.All };
}
