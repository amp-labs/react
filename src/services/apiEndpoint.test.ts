import { afterEach, describe, expect, it, jest } from "@jest/globals";

import {
  getAmpersandRegion,
  PROD_ENDPOINT,
  resolveApiEndpoint,
  setAmpersandRegion,
} from "./apiEndpoint";

const ENV_KEY = "REACT_APP_AMP_SERVER";

afterEach(() => {
  delete process.env[ENV_KEY];
  setAmpersandRegion(undefined);
  jest.restoreAllMocks();
});

describe("resolveApiEndpoint", () => {
  it("defaults to the global prod endpoint", () => {
    expect(resolveApiEndpoint()).toBe(PROD_ENDPOINT);
  });

  it("maps the eu region to the eu endpoint", () => {
    expect(resolveApiEndpoint("eu")).toBe("https://api.eu.withampersand.com");
  });

  it("ignores casing and surrounding whitespace in the region", () => {
    expect(resolveApiEndpoint(" EU ")).toBe("https://api.eu.withampersand.com");
  });

  it("falls back to the prod endpoint for an unknown region", () => {
    const error = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(resolveApiEndpoint("mars")).toBe(PROD_ENDPOINT);
    expect(error).toHaveBeenCalled();
  });

  it("lets REACT_APP_AMP_SERVER take priority over the region", () => {
    process.env[ENV_KEY] = "staging";
    expect(resolveApiEndpoint("eu")).toBe(
      "https://staging-api.withampersand.com",
    );
  });

  it("lets an arbitrary REACT_APP_AMP_SERVER url take priority over the region", () => {
    process.env[ENV_KEY] = "https://my-tunnel.example.com";
    expect(resolveApiEndpoint("eu")).toBe("https://my-tunnel.example.com");
  });

  it("applies the region when REACT_APP_AMP_SERVER is empty", () => {
    process.env[ENV_KEY] = "";
    expect(resolveApiEndpoint("eu")).toBe("https://api.eu.withampersand.com");
  });

  it("resolves the documented env values", () => {
    const cases: Array<[string, string]> = [
      ["local", "http://localhost:8080"],
      ["dev", "https://dev-api.withampersand.com"],
      ["staging", "https://staging-api.withampersand.com"],
      ["prod", PROD_ENDPOINT],
      ["mock", "http://127.0.0.1:4010"],
    ];

    cases.forEach(([env, expected]) => {
      process.env[ENV_KEY] = env;
      expect(resolveApiEndpoint()).toBe(expected);
    });
  });
});

describe("region store", () => {
  it("round-trips the region set by AmpersandProvider", () => {
    expect(getAmpersandRegion()).toBeUndefined();
    setAmpersandRegion("eu");
    expect(getAmpersandRegion()).toBe("eu");
    expect(resolveApiEndpoint(getAmpersandRegion())).toBe(
      "https://api.eu.withampersand.com",
    );
  });
});
