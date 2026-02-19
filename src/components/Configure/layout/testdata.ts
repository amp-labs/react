import { ProviderInfo } from "src/services/api";

// TODO: delete when custom auth is implemented
export const SHOW_CUSTOM_AUTH_TEST_DATA = false;

// test data for custom auth - delete file when custom auth is implemented
export const testProviderInfo: ProviderInfo = {
  name: "test-provider",
  displayName: "Test Provider",
  baseURL: "https://api.test-provider.com",
  authType: "custom",
  defaultModule: "test-module",
  support: {
    bulkWrite: {
      insert: true,
      update: true,
      upsert: true,
      _delete: true,
    },
    proxy: true,
    read: true,
    subscribe: true,
    write: true,
    _delete: true,
    search: {
      operators: {
        equals: true,
      },
    },
  },
  providerOpts: {
    modules: "test-module",
  },
  customOpts: {
    inputs: [
      {
        name: "apiKey",
        displayName: "API Key",
        prompt:
          "The API Key can be found in the API Keys section of the Test Provider dashboard.",
        docsURL: "https://example.com/docs/api-key",
      },
      {
        name: "apiPassword",
        displayName: "API Password",
        prompt:
          "The API Password can be found in the API Keys section of the Test Provider dashboard.",
        docsURL: "https://example.com/docs/api-password",
      },
    ],
    headers: [
      {
        name: "X-Api-Key",
        valueTemplate: "{apiKey}",
      },
      {
        name: "X-Api-Password",
        valueTemplate: "{apiPassword}",
      },
    ],
    queryParams: [
      {
        name: "api_key",
        valueTemplate: "{apiKey}",
      },
      {
        name: "api_password",
        valueTemplate: "{apiPassword}",
      },
    ],
  },
  metadata: {
    input: [
      {
        name: "region",
        displayName: "Region",
        docsURL: "https://example.com/docs/region",
      },
    ],
  },
};
