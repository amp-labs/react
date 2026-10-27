/**
 * Per-event subscribe behaviour for the install wizard.
 *
 * The caller decides the shape of the subscribe config; the server stores whatever
 * validates. These props say, for each event, whether the consumer gets a choice.
 *
 * An omitted event is not subscribed to at all. A present event is subscribed to, and
 * `userSelect` only decides whether the consumer is asked about it:
 *
 * - `userSelect: false` — subscribed, no question asked. For `updateEvent` this writes
 *   `watchFieldsAuto: "all"` only when no fields are named; `selectedFields` and
 *   `selectedFieldMappings` are themselves the watch set, so naming any field leaves
 *   `watchFieldsAuto` unset rather than contradicting that set.
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
