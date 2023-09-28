/* eslint-disable import/no-relative-packages */
// currently not using a bundler to support alias imports
import {
  Config,
  Configuration, Connection,
  DefaultApi, HydratedIntegrationAction,
  HydratedIntegrationField,
  HydratedIntegrationFieldExistent,
  HydratedIntegrationObject,
  HydratedRevision,
  Installation, Integration,
  IntegrationFieldMapping,
  Project,
} from '../../generated-sources/api/src';

import { getApiEndpoint } from './apiService';

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

const getApiRoot = (server: string, version: string): string => `${server}/${version}`;

// REACT_APP_AMP_SERVER=local npm start will use the local server
function assignRoot(): string {
  return getApiRoot(getApiEndpoint(), VERSION);
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
  Config,
  Connection,
  HydratedIntegrationAction,
  HydratedIntegrationObject,
  HydratedIntegrationField,
  HydratedRevision,
  Installation,
  Integration,
  HydratedIntegrationFieldExistent,
  IntegrationFieldMapping,
  Project,
};
