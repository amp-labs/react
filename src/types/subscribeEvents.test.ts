import { describe, expect, it } from "@jest/globals";

import type {
  InheritingSubscribeEvents,
  SubscribeEvents,
  SubscribeEventsByObject,
} from "./subscribeEvents";
import {
  autoAppliedSubscribeEvents,
  buildSubscribeConfigObjects,
  updateEventEnabled,
  updateEventWatchSpec,
} from "./subscribeEvents";

// Every object has to say whether it inherits. These cases are about the event keys, so
// they all take the inheriting answer, which leaves every event optional.
const inheriting = (
  events: Omit<InheritingSubscribeEvents, "inheritFieldsAndMappings">,
): SubscribeEvents => ({ inheritFieldsAndMappings: true, ...events });

// The prop's contract: an event key present means subscribe to it; absent means do not.
describe("autoAppliedSubscribeEvents", () => {
  it("returns nothing when the prop is absent", () => {
    expect(autoAppliedSubscribeEvents(undefined)).toEqual([]);
  });

  it("returns nothing for an object with no events", () => {
    expect(autoAppliedSubscribeEvents({ messages: inheriting({}) })).toEqual(
      [],
    );
  });

  it("applies an event whose key is present", () => {
    expect(
      autoAppliedSubscribeEvents({
        messages: inheriting({ updateEvent: {} }),
      }),
    ).toEqual([{ objectName: "messages", event: "updateEvent" }]);
  });

  it("ignores an omitted event rather than disabling it explicitly", () => {
    // createEvent is absent: not subscribed, and nothing to write.
    expect(
      autoAppliedSubscribeEvents({
        messages: inheriting({ deleteEvent: {} }),
      }),
    ).toEqual([{ objectName: "messages", event: "deleteEvent" }]);
  });

  it("applies every event an object lists", () => {
    expect(
      autoAppliedSubscribeEvents({
        messages: inheriting({
          createEvent: {},
          updateEvent: {},
          deleteEvent: {},
        }),
      }),
    ).toEqual([
      { objectName: "messages", event: "createEvent" },
      { objectName: "messages", event: "updateEvent" },
      { objectName: "messages", event: "deleteEvent" },
    ]);
  });

  it("handles several objects", () => {
    expect(
      autoAppliedSubscribeEvents({
        messages: inheriting({ createEvent: {} }),
        reactions: inheriting({ deleteEvent: {} }),
      }),
    ).toEqual([
      { objectName: "messages", event: "createEvent" },
      { objectName: "reactions", event: "deleteEvent" },
    ]);
  });
});

// The update event names the fields it wants; naming none means every field.
describe("updateEventWatchSpec", () => {
  it("watches all when there is no update event", () => {
    expect(updateEventWatchSpec(undefined)).toEqual({ watchFieldsAuto: "all" });
  });

  it("watches all when the caller named no fields", () => {
    expect(updateEventWatchSpec({})).toEqual({
      watchFieldsAuto: "all",
    });
  });

  it("watches all when the field list is present but empty", () => {
    expect(updateEventWatchSpec({ requiredWatchFields: [] })).toEqual({
      watchFieldsAuto: "all",
    });
  });

  it("watches the named fields", () => {
    expect(
      updateEventWatchSpec({
        requiredWatchFields: ["text", "user"],
      }),
    ).toEqual({ requiredWatchFields: ["text", "user"] });
  });
});

// enabled: false keeps the update event in the config, as never, so its watch fields can
// still name what the other events deliver.
describe("updateEventEnabled", () => {
  it("is always when there is no update event", () => {
    expect(updateEventEnabled(undefined)).toBe("always");
  });

  it("is always when the caller left enabled out", () => {
    expect(updateEventEnabled({})).toBe("always");
  });

  it("is never when the caller set enabled to false", () => {
    expect(updateEventEnabled({ enabled: false })).toBe("never");
  });
});

// The non-wizard flow writes the installation config directly, so the props have to
// produce the same config the wizard's draft would have held.
describe("buildSubscribeConfigObjects", () => {
  it("returns undefined when the prop is absent", () => {
    expect(buildSubscribeConfigObjects(undefined)).toBeUndefined();
  });

  it("returns undefined when the prop names no objects", () => {
    expect(buildSubscribeConfigObjects({})).toBeUndefined();
  });

  it("builds an object whose update event names its fields", () => {
    const objects = buildSubscribeConfigObjects({
      messages: {
        inheritFieldsAndMappings: false,
        updateEvent: {
          requiredWatchFields: ["text", "user"],
        },
      },
    });

    expect(objects?.messages).toEqual({
      objectName: "messages",
      destination: "",
      inheritFieldsAndMappings: false,
      updateEvent: {
        enabled: "always",
        requiredWatchFields: ["text", "user"],
      },
    });
  });

  it("installs without update events, keeping the update event's fields", () => {
    const objects = buildSubscribeConfigObjects({
      messages: {
        inheritFieldsAndMappings: false,
        createEvent: {},
        updateEvent: {
          enabled: false,
          requiredWatchFields: ["text", "user"],
        },
      },
    });

    expect(objects?.messages.createEvent).toEqual({ enabled: "always" });
    expect(objects?.messages.updateEvent).toEqual({
      enabled: "never",
      requiredWatchFields: ["text", "user"],
    });
  });

  it("watches all fields when an inheriting object named none", () => {
    const objects = buildSubscribeConfigObjects({
      contacts: {
        inheritFieldsAndMappings: true,
        updateEvent: {},
      },
    });

    expect(objects?.contacts.updateEvent).toEqual({
      enabled: "always",
      watchFieldsAuto: "all",
    });
  });

  it("omits an event left out entirely", () => {
    const objects = buildSubscribeConfigObjects({
      contacts: {
        inheritFieldsAndMappings: true,
        createEvent: {},
      },
    });

    expect(objects?.contacts.createEvent).toEqual({ enabled: "always" });
    expect(objects?.contacts.deleteEvent).toBeUndefined();
    expect(objects?.contacts.updateEvent).toBeUndefined();
  });

  it("never sends selectedFields or selectedFieldMappings: the prop cannot set them", () => {
    const objects = buildSubscribeConfigObjects({
      messages: {
        inheritFieldsAndMappings: false,
        updateEvent: { requiredWatchFields: ["text"] },
      },
    });

    expect(objects?.messages.selectedFields).toBeUndefined();
    expect(objects?.messages.selectedFieldMappings).toBeUndefined();
  });

  it("passes inheritFieldsAndMappings: false through for a subscribe-only object", () => {
    const objects = buildSubscribeConfigObjects({
      messages: {
        inheritFieldsAndMappings: false,
        createEvent: {},
        updateEvent: {
          enabled: false,
          requiredWatchFields: ["text"],
        },
      },
    });

    expect(objects?.messages.inheritFieldsAndMappings).toBe(false);
  });

  it("passes the caller's inheritFieldsAndMappings through", () => {
    const objects = buildSubscribeConfigObjects({
      contacts: {
        inheritFieldsAndMappings: true,
        createEvent: {},
      },
    });

    expect(objects?.contacts.inheritFieldsAndMappings).toBe(true);
  });

  it("builds every object the prop names", () => {
    const objects = buildSubscribeConfigObjects({
      messages: {
        inheritFieldsAndMappings: false,
        createEvent: {},
        updateEvent: { requiredWatchFields: ["text"] },
      },
      contacts: {
        inheritFieldsAndMappings: true,
        deleteEvent: {},
      },
    });

    expect(Object.keys(objects ?? {})).toEqual(["messages", "contacts"]);
  });
});

// A non-inheriting object has no read config to take fields from, and the server rejects one
// that names none, so the prop's type requires the update event's field list.
describe("SubscribeEvents type", () => {
  it("rejects a non-inheriting object without updateEvent.requiredWatchFields", () => {
    const withoutUpdateEvent: SubscribeEventsByObject = {
      // @ts-expect-error updateEvent is required when inheritFieldsAndMappings is false
      messages: {
        inheritFieldsAndMappings: false,
        createEvent: {},
      },
    };
    const withoutFields: SubscribeEventsByObject = {
      // @ts-expect-error requiredWatchFields is required when inheritFieldsAndMappings is false
      messages: {
        inheritFieldsAndMappings: false,
        updateEvent: {},
      },
    };

    expect(withoutUpdateEvent).toBeDefined();
    expect(withoutFields).toBeDefined();
  });

  it("rejects userSelect, which no install flow reads yet", () => {
    const events: SubscribeEventsByObject = {
      contacts: {
        inheritFieldsAndMappings: true,
        // @ts-expect-error userSelect is not part of the prop until a selection step exists
        createEvent: { userSelect: false },
      },
    };

    expect(events.contacts.inheritFieldsAndMappings).toBe(true);
  });

  it("lets an inheriting object leave the update event out", () => {
    const events: SubscribeEventsByObject = {
      contacts: {
        inheritFieldsAndMappings: true,
        createEvent: {},
      },
    };

    expect(events.contacts.inheritFieldsAndMappings).toBe(true);
  });
});
