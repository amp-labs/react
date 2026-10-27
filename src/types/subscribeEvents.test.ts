import { describe, expect, it } from "@jest/globals";

import { autoAppliedSubscribeEvents } from "./subscribeEvents";

// The prop's contract: an event key present means subscribe to it; absent means do not.
// Of the present ones, userSelect: false is settled by the wizard without asking, and
// userSelect: true is left for the consumer to answer.
describe("autoAppliedSubscribeEvents", () => {
  it("returns nothing when the prop is absent", () => {
    expect(autoAppliedSubscribeEvents(undefined)).toEqual([]);
  });

  it("returns nothing for an object with no events", () => {
    expect(autoAppliedSubscribeEvents({ messages: {} })).toEqual([]);
  });

  it("applies an event whose key is present with userSelect false", () => {
    expect(
      autoAppliedSubscribeEvents({
        messages: { updateEvent: { userSelect: false } },
      }),
    ).toEqual([{ objectName: "messages", event: "updateEvent" }]);
  });

  it("leaves an event with userSelect true for the consumer", () => {
    expect(
      autoAppliedSubscribeEvents({
        messages: { deleteEvent: { userSelect: true } },
      }),
    ).toEqual([]);
  });

  it("ignores an omitted event rather than disabling it explicitly", () => {
    // createEvent is absent: not subscribed, and nothing to write.
    expect(
      autoAppliedSubscribeEvents({
        messages: { deleteEvent: { userSelect: false } },
      }),
    ).toEqual([{ objectName: "messages", event: "deleteEvent" }]);
  });

  it("splits a mixed object into applied and asked", () => {
    expect(
      autoAppliedSubscribeEvents({
        messages: {
          createEvent: { userSelect: false },
          updateEvent: { userSelect: true },
          deleteEvent: { userSelect: false },
        },
      }),
    ).toEqual([
      { objectName: "messages", event: "createEvent" },
      { objectName: "messages", event: "deleteEvent" },
    ]);
  });

  it("handles several objects", () => {
    expect(
      autoAppliedSubscribeEvents({
        messages: { createEvent: { userSelect: false } },
        reactions: { deleteEvent: { userSelect: false } },
      }),
    ).toEqual([
      { objectName: "messages", event: "createEvent" },
      { objectName: "reactions", event: "deleteEvent" },
    ]);
  });
});
