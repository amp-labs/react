import { describe, expect, it } from "@jest/globals";

import {
  autoAppliedSubscribeEvents,
  buildSubscribeConfigObjects,
  updateEventWatchSpec,
} from "./subscribeEvents";

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

// An object that names fields is already telling the server what to watch, so the watch
// spec only has something to add when it names none.
describe("updateEventWatchSpec", () => {
  it("watches all when the caller named nothing", () => {
    expect(updateEventWatchSpec({})).toEqual({ watchFieldsAuto: "all" });
  });

  it("watches all when the field set is present but empty", () => {
    expect(
      updateEventWatchSpec({ selectedFields: [], selectedFieldMappings: {} }),
    ).toEqual({ watchFieldsAuto: "all" });
  });

  it("adds nothing when fields are named", () => {
    expect(updateEventWatchSpec({ selectedFields: ["text"] })).toEqual({});
  });

  it("adds nothing when only mappings are named", () => {
    expect(
      updateEventWatchSpec({ selectedFieldMappings: { timeStamp: "ts" } }),
    ).toEqual({});
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

  it("builds an object that carries its own fields and mappings", () => {
    const objects = buildSubscribeConfigObjects({
      messages: {
        selectedFields: ["text", "user"],
        selectedFieldMappings: { timeStamp: "ts" },
        createEvent: { userSelect: false },
      },
    });

    expect(objects?.messages).toEqual({
      objectName: "messages",
      destination: "",
      inheritFieldsAndMappings: false,
      selectedFields: { text: true, user: true },
      selectedFieldMappings: { timeStamp: "ts" },
      createEvent: { enabled: "always" },
    });
  });

  it("leaves the watch fields to the server when fields are named", () => {
    const objects = buildSubscribeConfigObjects({
      messages: {
        selectedFields: ["text"],
        updateEvent: { userSelect: false },
      },
    });

    expect(objects?.messages.updateEvent).toEqual({ enabled: "always" });
  });

  it("watches all fields when the caller named none", () => {
    const objects = buildSubscribeConfigObjects({
      messages: { updateEvent: { userSelect: false } },
    });

    expect(objects?.messages.updateEvent).toEqual({
      enabled: "always",
      watchFieldsAuto: "all",
    });
  });

  it("omits an event the consumer is asked about, and one left out entirely", () => {
    const objects = buildSubscribeConfigObjects({
      messages: {
        selectedFields: ["text"],
        createEvent: { userSelect: false },
        deleteEvent: { userSelect: true },
      },
    });

    expect(objects?.messages.createEvent).toEqual({ enabled: "always" });
    expect(objects?.messages.deleteEvent).toBeUndefined();
    expect(objects?.messages.updateEvent).toBeUndefined();
  });

  it("omits empty field sets rather than sending them", () => {
    const objects = buildSubscribeConfigObjects({
      messages: {
        selectedFields: [],
        selectedFieldMappings: {},
        createEvent: { userSelect: false },
      },
    });

    expect(objects?.messages.selectedFields).toBeUndefined();
    expect(objects?.messages.selectedFieldMappings).toBeUndefined();
  });

  it("builds every object the prop names", () => {
    const objects = buildSubscribeConfigObjects({
      messages: { createEvent: { userSelect: false } },
      reactions: { deleteEvent: { userSelect: false } },
    });

    expect(Object.keys(objects ?? {})).toEqual(["messages", "reactions"]);
  });
});
