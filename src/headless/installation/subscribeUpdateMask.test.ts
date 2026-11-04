import { describe, expect, it } from "@jest/globals";

import { subscribeObjectUpdateMasks } from "./subscribeUpdateMask";

const messages = {
  objectName: "messages",
  inheritFieldsAndMappings: false,
  createEvent: { enabled: "always" },
  updateEvent: { enabled: "always", requiredWatchFields: ["text", "user"] },
};

// The wizard updates an installation that `enabled: always` read objects already created, and
// that installation has no subscribe block, so the draft's subscribe objects must be masked
// or the server drops them.
describe("subscribeObjectUpdateMasks", () => {
  it("returns nothing when the draft has no subscribe objects", () => {
    expect(subscribeObjectUpdateMasks(undefined, { messages })).toEqual([]);
  });

  it("masks an object the installation does not have", () => {
    expect(subscribeObjectUpdateMasks({ messages }, undefined)).toEqual([
      "config.content.subscribe.objects.messages",
    ]);
  });

  it("leaves out an object the installation already has unchanged", () => {
    expect(
      subscribeObjectUpdateMasks({ messages }, { messages: { ...messages } }),
    ).toEqual([]);
  });

  it("treats an absent key and an undefined value as the same", () => {
    expect(
      subscribeObjectUpdateMasks(
        { messages },
        { messages: { ...messages, providerOptions: undefined } },
      ),
    ).toEqual([]);
  });

  it("masks an object whose contents changed", () => {
    expect(
      subscribeObjectUpdateMasks(
        { messages },
        {
          messages: {
            ...messages,
            updateEvent: { enabled: "always", requiredWatchFields: ["text"] },
          },
        },
      ),
    ).toEqual(["config.content.subscribe.objects.messages"]);
  });

  it("masks only the objects that changed", () => {
    const reactions = {
      objectName: "reactions",
      createEvent: { enabled: "always" },
    };

    expect(
      subscribeObjectUpdateMasks(
        { messages, reactions },
        { messages: { ...messages } },
      ),
    ).toEqual(["config.content.subscribe.objects.reactions"]);
  });
});
