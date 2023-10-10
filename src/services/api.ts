/* eslint-disable import/no-relative-packages */
// currently not using a bundler to support alias imports
import {
  Config,
  Configuration, Connection,
  CreateInstallationOperationRequest,
  CreateInstallationRequestConfig,
  DefaultApi, HydratedIntegrationAction,
  HydratedIntegrationField,
  HydratedIntegrationFieldExistent,
  HydratedIntegrationObject,
  HydratedRevision,
  Installation, Integration,
  IntegrationFieldMapping,
  Project,
  ProviderApp,
  UpdateInstallationRequestInstallationConfig,
} from '../../generated-sources/api/src';

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
const VERSION = 'v1';

function getApiEndpoint(): string {
  switch (process.env.REACT_APP_AMP_SERVER) {
    case 'local':
      return 'http://localhost:8080';
    case 'dev':
      return 'https://dev-api.withampersand.com';
    case 'staging':
      return 'https://staging-api.withampersand.com';
    case 'prod':
      return 'https://api.withampersand.com';
    case 'mock':
      return 'http://127.0.0.1:4010';
    case '':
      return 'https://api.withampersand.com';
    default:
      // The user may provide an arbitrary URL here if they want to, or else the
      // default prod url will be used.
      return process.env.REACT_APP_AMP_SERVER ?? 'https://api.withampersand.com';
  }
}

const getApiRoot = (server: string, version: string): string => `${server}/${version}`;

// REACT_APP_AMP_SERVER=local npm start will use the local server
function assignRoot(): string {
  return getApiRoot(getApiEndpoint(), VERSION);
}

export const AMP_SERVER = getApiEndpoint();
export const AMP_API_ROOT = assignRoot();

/**
   * we can modify the authentication, baseURL and other configurations to access
   * our API in the future
   *
   * When in dev mode we want to mock the PRISM_MOCK_URL
   *
   * */

const config = new Configuration({
  basePath: AMP_API_ROOT,
});

let apiValue = new DefaultApi(config);

// For testing, etc. we may want to use a different API configuration than the default
export const setApi = (api: DefaultApi) => {
  apiValue = api;
};

export const api = () => apiValue;

/**
   * Types exported from generated api
   */
export type {
  Config,
  Connection,
  CreateInstallationOperationRequest,
  CreateInstallationRequestConfig,
  HydratedIntegrationAction,
  HydratedIntegrationObject,
  HydratedIntegrationField,
  HydratedRevision,
  Installation,
  Integration,
  HydratedIntegrationFieldExistent,
  IntegrationFieldMapping,
  Project,
  ProviderApp,
  UpdateInstallationRequestInstallationConfig,
};
