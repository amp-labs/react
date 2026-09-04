// currently not using a bundler to support alias imports
import { useCallback } from "react";
import {
  BackfillConfig,
  BaseWriteConfigObject,
  Config,
  Configuration,
  Connection,
  CreateInstallationOperationRequest,
  CreateInstallationRequestConfig,
  DynamicMappingsInputEntry,
  HydratedIntegrationField,
  HydratedIntegrationFieldExistent,
  HydratedIntegrationObject,
  HydratedIntegrationRead,
  HydratedIntegrationWrite,
  HydratedIntegrationWriteObject,
  HydratedRevision,
  Installation,
  Integration,
  IntegrationFieldMapping,
  OauthConnectOperationRequest,
  Project,
  ProviderApp,
  ProviderInfo,
  UpdateInstallationOperationRequest,
  UpdateInstallationRequestInstallationConfig,
} from "@generated/api/src";
import { useApiKey } from "src/context/ApiKeyContextProvider";
import { useJwtToken } from "src/context/JwtTokenContextProvider";
import { useInstallationProps } from "src/headless/InstallationProvider";

import { getAmpersandRegion, resolveApiEndpoint } from "./apiEndpoint";
import { ApiService } from "./ApiService";
import { LIB_VERSION } from "./version";

/**
 * To update the api you need to
 * 1. git clone `https://github.com/amp-labs/server` into a sibling directory
 * 2. run `yarn generate-api`
 *
 */

/**
 * When we run ```prism mock -d ./openapi/api.yaml```, prism will mock a server
 * based on the api.yaml swagger (open-api v2) spec
 *
 * */
const VERSION = "v1";

const getApiRoot = (server: string, version: string): string =>
  `${server}/${version}`;

/**
 * The API server origin, e.g. "https://api.withampersand.com". Resolved on every call because
 * the region (set by AmpersandProvider) is not known at module load time.
 *
 * REACT_APP_AMP_SERVER=local npm start will use the local server.
 */
export const getAmpServer = (): string =>
  resolveApiEndpoint(getAmpersandRegion());

/**
 * The versioned API root used as the SDK basePath, e.g. "https://api.withampersand.com/v1".
 */
export const getAmpApiRoot = (): string => getApiRoot(getAmpServer(), VERSION);

/**
 * we can modify the authentication, baseURL and other configurations to access
 * our API in the future
 *
 * When in dev mode we want to mock the PRISM_MOCK_URL
 *
 * */

const config = new Configuration({
  basePath: getAmpApiRoot(),
  headers: {
    "X-Amp-Client": "react",
    "X-Amp-Client-Version": LIB_VERSION,
  },
});

let apiValue = new ApiService(config);

// For testing, etc. we may want to use a different API configuration than the default
export const setApi = (api: ApiService) => {
  apiValue = api;
};

/**
 * @deprecated
 */
export const api = () => apiValue;

// Authentication helper functions
const createApiKeyAuth = (apiKey: string) => ({
  header: "X-Api-Key",
  value: apiKey,
});

const createJwtAuth = (token: string) => {
  try {
    return {
      header: "Authorization",
      value: `Bearer ${token}`,
    };
  } catch (error) {
    console.error("Failed to get JWT token for API authentication:", error);
    throw new Error("Failed to authenticate with JWT token");
  }
};

const createAuthConfig = (authHeader: string, authValue: string) =>
  new Configuration({
    basePath: getAmpApiRoot(),
    headers: {
      "X-Amp-Client": "react",
      "X-Amp-Client-Version": LIB_VERSION,
      [authHeader]: authValue,
    },
  });

// TODO: remove this flag when we have a proper JWT auth flow
const ENABLE_JWT_AUTH_FF = true;

/**
 * hook to access the API service
 *
 * @param groupRefOverride - Optional groupRef to use instead of context value.
 *                           Required for JWT auth if not provided via InstallationProvider.
 * @param consumerRefOverride - Optional consumerRef to use instead of context value.
 *                              Required for JWT auth if not provided via InstallationProvider.
 * @returns A function that returns a Promise resolving to an ApiService instance
 *
 * @remarks
 * For JWT authentication, consumerRef and groupRef must be provided either:
 * 1. Via InstallationProvider context, or
 * 2. As parameters to this hook (overrides context values)
 *
 * For API key authentication, these parameters are not required.
 */
export function useAPI(
  groupRefOverride?: string,
  consumerRefOverride?: string,
): () => Promise<ApiService> {
  const apiKey = useApiKey();
  const { getToken } = useJwtToken();
  const contextProps = useInstallationProps(); // in InstallationProvider

  // Use provided overrides, fall back to context values
  const consumerRef = consumerRefOverride || contextProps.consumerRef;
  const groupRef = groupRefOverride || contextProps.groupRef;

  /** Even though it doesn't need to be be async right now, we want to be able to support other ways
   * to authenticating to the API in the future which may require async operations */
  const getAPI = useCallback(async () => {
    if (apiKey) {
      const auth = createApiKeyAuth(apiKey);
      const configWithAuth = createAuthConfig(auth.header, auth.value);
      return new ApiService(configWithAuth);
    }

    if (getToken) {
      if (!ENABLE_JWT_AUTH_FF) {
        console.warn(
          "JWT authentication is disabled. Please use API key authentication.",
        );
        throw new Error(
          "JWT authentication is disabled. Please use API key authentication.",
        );
      }

      if (!consumerRef || !groupRef) {
        console.error(
          "Unable to create JWT API service without consumerRef or groupRef.",
          { consumerRef, groupRef },
        );
        throw new Error(
          "Unable to create JWT API service without consumerRef or groupRef. " +
            "Provide via InstallationProvider or useAPI parameters.",
        );
      }
      const token = await getToken({ consumerRef, groupRef });
      const auth = createJwtAuth(token);
      const configWithAuth = createAuthConfig(auth.header, auth.value);
      return new ApiService(configWithAuth);
    }

    console.error("Unable to create API service without API key or JWT token.");
    throw new Error(
      "Unable to create API service without API key or JWT token.",
    );
  }, [apiKey, getToken, consumerRef, groupRef]);

  return getAPI;
}

/**
 * Types exported from generated api
 */
export type {
  BackfillConfig,
  BaseWriteConfigObject,
  Config,
  Connection,
  CreateInstallationOperationRequest,
  CreateInstallationRequestConfig,
  HydratedIntegrationRead,
  HydratedIntegrationWrite,
  HydratedIntegrationWriteObject,
  HydratedIntegrationObject,
  HydratedIntegrationField,
  HydratedRevision,
  Installation,
  Integration,
  HydratedIntegrationFieldExistent,
  IntegrationFieldMapping,
  OauthConnectOperationRequest,
  Project,
  ProviderApp,
  ProviderInfo,
  UpdateInstallationOperationRequest,
  UpdateInstallationRequestInstallationConfig,
  DynamicMappingsInputEntry,
};
