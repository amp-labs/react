/**
 * DEPRECATED: this file will be deleted as the generated SDK will be used instead.
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from 'react';
import axios from 'axios';

import { ApiKeyContext } from '../context/ApiKeyContext';

const VERSION = 'v1';

export function getApiEndpoint(): string {
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
  const apiKey = useContext(ApiKeyContext);
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
      'X-Api-Key': apiKey ?? '',
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
  const apiKey = useContext(ApiKeyContext);
  const POST_CONSUMER_URL = `${AMP_API_ROOT}/projects/${projectId}/consumers`;
  return axios.post(POST_CONSUMER_URL, {
    ConsumerRef: userId,
    ConsumerName: consumerName,
  }, {
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey ?? '',
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
  const apiKey = useContext(ApiKeyContext);
  const POST_CONSUMER_URL = `${AMP_API_ROOT}/projects/${projectId}/groups`;
  return axios.post(POST_CONSUMER_URL, {
    GroupRef: groupId,
    GroupName: groupName,
  }, {
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey ?? '',
    },
  });
}
