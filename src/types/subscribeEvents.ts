import type { SubscribeConfigObject } from "@generated/api/src";
import {
  ConfigCreateEventEnabledEnum,
  ConfigDeleteEventEnabledEnum,
  ConfigUpdateEventEnabledEnum,
  ConfigUpdateEventWatchFieldsAutoEnum,
} from "@generated/api/src";

/**
 * Per-event subscribe behaviour for the install wizard.
 *
 * The caller decides the shape of the subscribe config; the server stores whatever
 * validates. These props say, for each event, whether the consumer gets a choice.
 *
 * An omitted event is not subscribed to at all. A present event is subscribed to, and
 * `userSelect` only decides whether the consumer is asked about it. The one exception is an
 * update event with `enabled: false`, which is written as `never` so that its
 * `requiredWatchFields` can name the fields the other events deliver.
 *
 *
 * - `userSelect: false` — subscribed, no question asked. For `updateEvent`, the event
 *   watches the fields in `requiredWatchFields`; an inheriting object that names none watches
 *   every field (`watchFieldsAuto: "all"`).
 * - `userSelect: true` — the wizard asks. For `createEvent` and `deleteEvent` that is
 *   whether to subscribe; for `updateEvent` it is also which fields to watch.
 *
 * @experimental
 */
export interface SubscribeEventOption {
  /** Whether the consumer chooses this event's behaviour in the wizard. */
  userSelect: boolean;
}

/**
 * An update event, which additionally says which field changes it wants to hear about.
 *
 * @experimental
 */
export interface SubscribeUpdateEventOption extends SubscribeEventOption {
  /**
   * Provider field names whose changes trigger an update event.
   *
   * For an object with `inheritFieldsAndMappings: false` they are also the fields every event
   * delivers, and they are required: the object has no read config to take fields from, and
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
   * `never`, and `requiredWatchFields` remains the list of fields the create and delete
   * events deliver. It is how a subscribe-only object that wants no updates names its fields,
   * since `requiredWatchFields` is the only field list these props take. Applies to an event
   * the consumer is not asked about (`userSelect: false`).
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
 * event. The config schema also has `selectedFields` and `selectedFieldMappings`, and neither
 * is accepted here **yet**: a field-selection step is coming, and these props are for what a
 * caller settles without asking the consumer. The server accepts all three, so nothing here
 * is a limit on the config itself — `useConfigHelper`'s `subscribeObject()` already has
 * `setSelectedFields` and `setSelectedFieldMappings` for that step to write through.
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
 * Omit an event to leave it unsubscribed.
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
 * `{ messages: { inheritFieldsAndMappings: false, updateEvent: { userSelect: false, requiredWatchFields: ["text"] } } }`.
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
 * Picks the events the wizard configures on the consumer's behalf.
 *
 * An event is subscribed to only if its key is present. Of those, the ones with
 * `userSelect: false` are settled without a question; `userSelect: true` is left for the
 * wizard to ask about and is not returned here.
 */
export function autoAppliedSubscribeEvents(
  subscribeEvents: SubscribeEventsByObject | undefined,
): AutoAppliedSubscribeEvent[] {
  if (!subscribeEvents) return [];

  const events: AutoAppliedSubscribeEvent[] = [];
  const eventKeys = ["createEvent", "updateEvent", "deleteEvent"] as const;

  Object.entries(subscribeEvents).forEach(([objectName, perObject]) => {
    eventKeys.forEach((event) => {
      const option = perObject[event];
      // Absent key: not subscribed at all. Present with userSelect: the wizard asks.
      if (option && !option.userSelect) events.push({ objectName, event });
    });
  });

  return events;
}

/** How an update event says which field changes it wants to be told about. */
export type UpdateEventWatchSpec =
  | { requiredWatchFields: string[] }
  | { watchFieldsAuto: ConfigUpdateEventWatchFieldsAutoEnum };

/**
 * How an update event the consumer was not asked about decides what to watch.
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

/**
 * The config `enabled` value for an update event the consumer was not asked about: `never`
 * when the caller set `enabled: false`, `always` otherwise.
 */
export function updateEventEnabled(
  updateEvent: SubscribeUpdateEventOption | undefined,
): ConfigUpdateEventEnabledEnum {
  return updateEvent?.enabled === false
    ? ConfigUpdateEventEnabledEnum.Never
    : ConfigUpdateEventEnabledEnum.Always;
}

/**
 * Builds the subscribe config these props describe, for a flow that writes the installation
 * config directly rather than through the wizard's draft.
 *
 * Same decisions as `useApplySubscribeEvents` makes against the draft: only the events the
 * consumer is not asked about, and the update event's fields as the caller wrote them.
 *
 * Returns undefined when there is nothing to configure, so a caller can omit the block.
 */
export function buildSubscribeConfigObjects(
  subscribeEvents: SubscribeEventsByObject | undefined,
): { [key: string]: SubscribeConfigObject } | undefined {
  if (!subscribeEvents) return undefined;

  const objects: { [key: string]: SubscribeConfigObject } = {};

  Object.entries(subscribeEvents).forEach(([objectName, events]) => {
    const object: SubscribeConfigObject = {
      objectName,
      // The revision supplies the real destination; the hydrated revision carries no
      // subscribe block, so there is nothing here to name it with.
      destination: "",
      // Always written out: an omitted value falls back to the manifest's
      // inheritFieldsAndMapping, which these props do not see.
      inheritFieldsAndMappings: events.inheritFieldsAndMappings,
    };

    autoAppliedSubscribeEvents({ [objectName]: events }).forEach(
      ({ event }) => {
        if (event === "createEvent") {
          object.createEvent = { enabled: ConfigCreateEventEnabledEnum.Always };
        }

        if (event === "deleteEvent") {
          object.deleteEvent = { enabled: ConfigDeleteEventEnabledEnum.Always };
        }

        if (event === "updateEvent") {
          object.updateEvent = {
            enabled: updateEventEnabled(events.updateEvent),
            ...updateEventWatchSpec(events.updateEvent),
          };
        }
      },
    );

    objects[objectName] = object;
  });

  return Object.keys(objects).length > 0 ? objects : undefined;
}
