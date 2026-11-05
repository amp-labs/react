import { describe, expect, it } from "@jest/globals";

import type {
  InheritingSubscribeEvents,
  SubscribeEvents,
  SubscribeEventsByObject,
} from "./subscribeEvents";
import {
  autoAppliedSubscribeEvents,
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
