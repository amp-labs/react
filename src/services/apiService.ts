/**
 * DEPRECATED: this file will be deleted as the generated SDK will be used instead.
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';

// import { sampleIntegrationConfig, TestSourceList } from '../testData/integrationSource';
import { IntegrationConfig } from '../types/configTypes';

const VERSION = 'v1';

export const AMP_SERVER = process.env.REACT_APP_AMP_SERVER === 'local'
  ? 'http://localhost:8080'
  : 'https://api.withampersand.com';

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
  projectID: string,
) {
  return axios.post(CONNECT_OAUTH_URL, {
    providerWorkspaceRef: subdomain,
    provider: api,
    projectId: projectID,
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
  projectID: string,
  consumerName = 'Test Consumer', // test data
) {
  const POST_CONSUMER_URL = `${AMP_API_ROOT}/projects/${projectID}/consumers`;
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
  projectID: string,
  groupName = 'Test Group', // test data
) {
  const POST_CONSUMER_URL = `${AMP_API_ROOT}/projects/${projectID}/groups`;
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
  projectID: string,
  consumerRef: string,
  groupRef: string,
  provider = 'salesforce',
): Promise<IntegrationConfig> {
  const LIST_CONNECTIONS_URL = `${AMP_API_ROOT}/projects/${projectID}/connections`;
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
