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
 * `userSelect` only decides whether the consumer is asked about it:
 *
 * - `userSelect: false` — subscribed, no question asked. For `updateEvent`, an object that
 *   names fields watches exactly those, and one that names none watches everything
 *   (`watchFieldsAuto: "all"`).
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
 * Subscribe behaviour per event type, keyed the same way the installation config is.
 * Omit an event to leave it unsubscribed.
 *
 * @experimental
 */
export interface SubscribeEvents {
  /**
   * Whether this object takes its fields and mappings from the matching read object.
   *
   * Required, with no default: the server reads an absent value as `true`, so a value
   * this library guessed would decide the object's shape silently. Say which it is.
   *
   * `false` for a subscribe-only object, which is the only value that works: it has no
   * read object behind it, and an inheriting object with none is rejected with "read
   * object config is required to subscribe object".
   *
   * `true` for an object that does have a read action. Leave `selectedFields` and
   * `selectedFieldMappings` unset in that case — the server rejects an inheriting object
   * that also carries its own.
   */
  inheritFieldsAndMappings: boolean;
  /**
   * Fields to deliver with each event, by provider field name.
   *
   * Required for a subscribe-only object: it has no read config to inherit a field set
   * from, and the server rejects a non-inheriting subscribe object that selects nothing
   * (`selectedFields or selectedFieldMappings is required when inheritFieldsAndMappings
   * is false`). There is no field metadata for subscribe objects, so these are taken as
   * written and not validated against the provider.
   */
  selectedFields?: string[];
  /** Mapped field name to provider field name, for events that need a mapping. */
  selectedFieldMappings?: Record<string, string>;
  createEvent?: SubscribeEventOption;
  updateEvent?: SubscribeEventOption;
  deleteEvent?: SubscribeEventOption;
}

/**
 * Subscribe props per object name, e.g. `{ messages: { updateEvent: { userSelect: false } } }`.
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
  | { watchFieldsAuto: ConfigUpdateEventWatchFieldsAutoEnum }
  | Record<string, never>;

/**
 * How an update event the consumer was not asked about decides what to watch.
 *
 * An object that names fields watches exactly those: the server reads its `selectedFields`
 * and `selectedFieldMappings` as the watch set, so repeating them as `requiredWatchFields`
 * would be the same list written twice. An object that names none has nothing to watch by,
 * and watches everything.
 *
 * Both halves of that are the server's rules, not a choice made here. A config update event
 * is rejected unless it carries `requiredWatchFields`, `watchFieldsAuto`, or fields of its
 * own, and `watchFieldsAuto` has exactly one value in a config, `"all"`.
 */
export function updateEventWatchSpec(
  events: Pick<SubscribeEvents, "selectedFields" | "selectedFieldMappings">,
): UpdateEventWatchSpec {
  const namesFields =
    Boolean(events.selectedFields?.length) ||
    Object.keys(events.selectedFieldMappings ?? {}).length > 0;

  return namesFields
    ? {}
    : { watchFieldsAuto: ConfigUpdateEventWatchFieldsAutoEnum.All };
}

/**
 * Builds the subscribe config these props describe, for a flow that writes the installation
 * config directly rather than through the wizard's draft.
 *
 * Same decisions as `useApplySubscribeEvents` makes against the draft: only the events the
 * consumer is not asked about, fields as the caller wrote them, and `watchFieldsAuto` left
 * unset whenever fields were named.
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
      // Always written out: an omitted value is read as `true` by the server, which then
      // demands a read object a subscribe-only object does not have.
      inheritFieldsAndMappings: events.inheritFieldsAndMappings,
    };

    if (events.selectedFields?.length) {
      object.selectedFields = Object.fromEntries(
        events.selectedFields.map((field) => [field, true]),
      );
    }

    if (Object.keys(events.selectedFieldMappings ?? {}).length > 0) {
      object.selectedFieldMappings = events.selectedFieldMappings;
    }

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
            enabled: ConfigUpdateEventEnabledEnum.Always,
            ...updateEventWatchSpec(events),
          };
        }
      },
    );

    objects[objectName] = object;
  });

  return Object.keys(objects).length > 0 ? objects : undefined;
}
