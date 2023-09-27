/**
 * DEPRECATED: this file will be deleted as the generated SDK will be used instead.
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';

import { IntegrationConfig } from '../types/configTypes';

const VERSION = 'v1';

export function getApiEndpoint(): string {
  switch (process.env.REACT_APP_AMP_SERVER) {
    case 'local':
      return 'http://localhost:8080';
    case 'dev':
      return 'dev-api.withampersand.com';
    case 'staging':
      return 'staging-api.withampersand.com';
    case 'prod':
      return 'https://api.withampersand.com';
    case '':
      return 'https://api.withampersand.com';
    default:
      // The user may provide an arbitrary URL here if they want to, or else the
      // default prod url will be used.
      return process.env.REACT_APP_AMP_SERVER ?? 'https://api.withampersand.com';
  }
}

export const AMP_SERVER = getApiEndpoint();

export const AMP_API_ROOT = `${AMP_SERVER}/${VERSION}`;

const CONNECT_OAUTH_URL = `${AMP_API_ROOT}/oauth-connect`;

/**
 * @deprecated The method should not be used
 */
export async function postConnectOAuth(
  userId: string,
  groupId: string,
  api: string,
  subdomain: string,
  projectId: string,
) {
  return axios.post(CONNECT_OAUTH_URL, {
    providerWorkspaceRef: subdomain,
    provider: api,
    projectId,
    // The following IDs are from the DB seed data.
    // TODO: replace.
    groupRef: groupId,
    consumerRef: userId,
    providerAppId: '85401a99-9395-4929-b57f-32da59048f2e',
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
/**
 * @deprecated The method should not be used
 */
export async function postCreateConsumer(
  userId: string, // 'consumerRef:p0-c1' // seed data
  projectId: string,
  consumerName = 'Test Consumer', // test data
) {
  const POST_CONSUMER_URL = `${AMP_API_ROOT}/projects/${projectId}/consumers`;
  return axios.post(POST_CONSUMER_URL, {
    ConsumerRef: userId,
    ConsumerName: consumerName,
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * @deprecated The method should not be used
 */
export async function postCreateGroup(
  groupId: string,
  projectId: string,
  groupName = 'Test Group', // test data
) {
  const POST_CONSUMER_URL = `${AMP_API_ROOT}/projects/${projectId}/groups`;
  return axios.post(POST_CONSUMER_URL, {
    GroupRef: groupId,
    GroupName: groupName,
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// /projects/{projectId}/connections
/**
 * @deprecated The method should not be used
 */
export async function getListConnections(
  projectId: string,
  consumerRef: string,
  groupRef: string,
  provider = 'salesforce',
): Promise<IntegrationConfig> {
  const LIST_CONNECTIONS_URL = `${AMP_API_ROOT}/projects/${projectId}/connections`;
  return axios.get(LIST_CONNECTIONS_URL, {
    params: {
      provider,
      groupRef,
      consumerRef,
    },
  });
  // TODO: rip out mock and make network call to return real configuration object
  // return sampleIntegrationConfig;
}

/**
 * @deprecated The method should not be used
 */
export async function postUserConfig(
  userId: string,
  groupId: string,
  integrationName: string,
  integrationConfig: IntegrationConfig,
): Promise<void> {
  // TODO: Replace stub with network call.
  console.log(integrationConfig); // eslint-disable-line
}
