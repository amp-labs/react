import { describe, expect, it } from "@jest/globals";

import { namedFields, type SubscribeConfigByObject } from "./subscribeConfig";

describe("SubscribeConfigByObject", () => {
  it("takes the installation API's subscribe object, keyed by object name", () => {
    const config: SubscribeConfigByObject = {
      messages: {
        inheritFieldsAndMappings: false,
        selectedFieldMappings: { timeStamp: "ts" },
        createEvent: { enabled: "always" },
        updateEvent: { enabled: "never", requiredWatchFields: ["text"] },
        otherEvents: ["reaction_added"],
      },
    };

    expect(config.messages.updateEvent?.enabled).toBe("never");
  });

  it("leaves destination and inheritFieldsAndMappings optional", () => {
    const config: SubscribeConfigByObject = {
      messages: { createEvent: { enabled: "always" } },
    };

    expect(config.messages.destination).toBeUndefined();
  });

  it("takes objectName from the key, not the value", () => {
    const config: SubscribeConfigByObject = {
      // @ts-expect-error objectName comes from the key
      messages: { objectName: "messages" },
    };

    expect(Object.keys(config)).toEqual(["messages"]);
  });
});

describe("namedFields", () => {
  it("lists selected fields, watch fields and mapped names once each", () => {
    expect(
      namedFields({
        selectedFields: { text: true, user: true, channel: false },
        updateEvent: { enabled: "always", requiredWatchFields: ["text", "ts"] },
        selectedFieldMappings: { timeStamp: "ts" },
      }),
    ).toEqual(["text", "user", "ts", "timeStamp"]);
  });

  it("is empty for an object that names no fields", () => {
    expect(namedFields({ createEvent: { enabled: "always" } })).toEqual([]);
  });
});
