import { afterEach, describe, expect, it, jest } from "@jest/globals";

import {
  normalizeRegion,
  PROD_EU_ENDPOINT,
  PROD_US_ENDPOINT,
  resolveApiEndpoint,
} from "./apiEndpoint";

const ENV_KEY = "REACT_APP_AMP_SERVER";

function setEnv(value?: string) {
  if (value === undefined) {
    delete process.env[ENV_KEY];
  } else {
    process.env[ENV_KEY] = value;
  }
}

afterEach(() => {
  setEnv(undefined);
  jest.restoreAllMocks();
});

describe("resolveApiEndpoint", () => {
  it("defaults to the global prod endpoint", () => {
    expect(resolveApiEndpoint()).toBe(PROD_US_ENDPOINT);
  });

  it("maps the eu region to the eu endpoint", () => {
    expect(resolveApiEndpoint("eu")).toBe(PROD_EU_ENDPOINT);
  });

  it("maps the us region to the default endpoint", () => {
    expect(resolveApiEndpoint("us")).toBe(PROD_US_ENDPOINT);
  });

  it("ignores casing and surrounding whitespace in the region", () => {
    expect(resolveApiEndpoint(" EU ")).toBe(PROD_EU_ENDPOINT);
  });

  it("falls back to the us endpoint for an unknown region", () => {
    const error = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(resolveApiEndpoint("mars")).toBe(PROD_US_ENDPOINT);
    expect(error).toHaveBeenCalled();
  });

  it("does not resolve inherited object keys to an endpoint", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    [
      "constructor",
      "__proto__",
      "toString",
      "valueOf",
      "hasOwnProperty",
    ].forEach((key) => {
      expect(resolveApiEndpoint(key)).toBe(PROD_US_ENDPOINT);
    });
  });

  it("falls back instead of throwing for a non-string region", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    [123, true, {}, [], () => {}, Symbol("eu")].forEach((value) => {
      expect(resolveApiEndpoint(value)).toBe(PROD_US_ENDPOINT);
    });
  });

  it("treats null and whitespace-only as unset, without logging", () => {
    const error = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(resolveApiEndpoint(null)).toBe(PROD_US_ENDPOINT);
    expect(resolveApiEndpoint("   ")).toBe(PROD_US_ENDPOINT);
    expect(error).not.toHaveBeenCalled();
  });

  it("lets REACT_APP_AMP_SERVER take priority over the region", () => {
    setEnv("staging");
    expect(resolveApiEndpoint("eu")).toBe(
      "https://staging-api.withampersand.com",
    );
  });

  it("lets an arbitrary REACT_APP_AMP_SERVER url take priority over the region", () => {
    setEnv("https://my-tunnel.example.com");
    expect(resolveApiEndpoint("eu")).toBe("https://my-tunnel.example.com");
  });

  it("applies the region when REACT_APP_AMP_SERVER is empty", () => {
    setEnv("");
    expect(resolveApiEndpoint("eu")).toBe(PROD_EU_ENDPOINT);
  });

  it("resolves the documented env values", () => {
    const cases: Array<[string, string]> = [
      ["local", "http://localhost:8080"],
      ["dev", "https://dev-api.withampersand.com"],
      ["staging", "https://staging-api.withampersand.com"],
      ["prod", PROD_US_ENDPOINT],
      ["mock", "http://127.0.0.1:4010"],
    ];

    cases.forEach(([env, expected]) => {
      setEnv(env);
      expect(resolveApiEndpoint()).toBe(expected);
    });
  });

  it("does not throw when process is unavailable", () => {
    const savedProcess = globalThis.process;
    // Simulate a browser bundle with no process shim (e.g. plain Vite).
    // @ts-expect-error deliberately removing the global for this test
    delete globalThis.process;
    try {
      expect(resolveApiEndpoint()).toBe(PROD_US_ENDPOINT);
      expect(resolveApiEndpoint("eu")).toBe(PROD_EU_ENDPOINT);
    } finally {
      globalThis.process = savedProcess;
    }
  });
});

describe("normalizeRegion", () => {
  it("returns undefined for an unset region", () => {
    expect(normalizeRegion(undefined)).toBeUndefined();
    expect(normalizeRegion(null)).toBeUndefined();
    expect(normalizeRegion("  ")).toBeUndefined();
  });

  it("canonicalises a known region", () => {
    expect(normalizeRegion(" EU ")).toBe("eu");
    expect(normalizeRegion("us")).toBe("us");
  });

  it("drops an unknown region so the provider stores only valid values", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    expect(normalizeRegion("mars")).toBeUndefined();
    expect(resolveApiEndpoint(normalizeRegion("mars"))).toBe(PROD_US_ENDPOINT);
  });
});
