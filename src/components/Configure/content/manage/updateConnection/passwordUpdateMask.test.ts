import { describe, expect, it } from "@jest/globals";

import { passwordUpdateMask } from "./passwordUpdateMask";

describe("passwordUpdateMask", () => {
  it("leaves out blank client fields, so the connection keeps its client", () => {
    expect(passwordUpdateMask({ clientId: "", clientSecret: "" })).toEqual([
      "oauth2PasswordCredentials.username",
      "oauth2PasswordCredentials.password",
    ]);
  });

  it("names both client fields when either is filled in", () => {
    const withClient = [
      "oauth2PasswordCredentials.username",
      "oauth2PasswordCredentials.password",
      "oauth2PasswordCredentials.clientId",
      "oauth2PasswordCredentials.clientSecret",
    ];

    expect(passwordUpdateMask({ clientId: "id", clientSecret: "" })).toEqual(
      withClient,
    );
    expect(
      passwordUpdateMask({ clientId: "", clientSecret: "secret" }),
    ).toEqual(withClient);
  });
});
