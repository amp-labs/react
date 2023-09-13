/* eslint-disable import/no-relative-packages */
// currently not using a bundler to support alias imports
import {
  Configuration, DefaultApi, Installation, Integration,
} from '../../generated-sources/api/src/index';

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
const PRISM_MOCK_URL = 'http://127.0.0.1:4010';

const LOCAL_URL = 'http://localhost:8080';
const DEV_URL = 'https:// dev-api.withampersand.com';
const STAGING_URL = 'https://staging-api.withampersand.com';
const PRODUCTION_URL = 'https://api.withampersand.com';
const VERSION = 'v1';

const getApiRoot = (server: string, version: string): string => `${server}/${version}`;

// REACT_APP_AMP_SERVER=local npm start will use the local server
function assignRoot(): string {
  const env = process.env.REACT_APP_AMP_SERVER;
  switch (env) {
    case 'prod':
      return getApiRoot(PRODUCTION_URL, VERSION);
    case 'staging':
      return getApiRoot(STAGING_URL, VERSION);
    case 'dev':
      return getApiRoot(DEV_URL, VERSION);
    case 'local':
      return getApiRoot(LOCAL_URL, VERSION);
    case 'mock':
      return PRISM_MOCK_URL;
    default:
      return getApiRoot(PRODUCTION_URL, VERSION);
  }
}

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

export const api = new DefaultApi(config);

/**
   * Types exported from generated api
   */
export type {
  Integration,
  Installation,
};
