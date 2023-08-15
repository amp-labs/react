/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';

import { sampleIntegrationConfig, TestSourceList } from '../testData/integrationSource';
import { IntegrationConfig } from '../types/configTypes';

const VERSION = 'v1';

export const AMP_BACKEND_SERVER = process.env.REACT_APP_AMP_SERVER === 'local'
  ? `http://localhost:8080/${VERSION}`
  : `https://api.withampersand.com/${VERSION}`;

const CONNECT_OAUTH_URL = `${AMP_BACKEND_SERVER}/oauth-connect`;

/**
 * Get all integrations for a builder.
 *
 * @param projectId {string} Builder's project ID
 * @param apiKey {string} Builder's API key.
 * @returns {Promise} Then-able promise to handle success and failure from caller.
 */
export async function getIntegrations(projectID: string, apiKey: string) {
  // TODO: replace with a real API call to GetIntegrations
  return { data: TestSourceList };
}

export async function postConnectOAuth(
  userId: string,
  groupId: string,
  api: string,
  subdomain: string,
  projectID: string,
) {
  return axios.post(CONNECT_OAUTH_URL, {
    ProviderWorkspaceRef: subdomain,
    Provider: api,
    ProjectId: projectID,
    // The following IDs are from the DB seed data.
    // TODO: replace.
    GroupRef: groupId,
    ConsumerRef: userId,
    ProviderAppId: '85401a99-9395-4929-b57f-32da59048f2e',
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function postCreateConsumer(
  userId: string, // 'consumerRef:p0-c1' // seed data
  projectID: string,
  consumerName = 'Test Consumer', // test data
) {
  const POST_CONSUMER_URL = `${AMP_BACKEND_SERVER}/projects/${projectID}/consumers`;
  return axios.post(POST_CONSUMER_URL, {
    ConsumerRef: userId,
    ConsumerName: consumerName,
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function postCreateGroup(
  groupId: string,
  projectID: string,
  groupName = 'Test Group', // test data
) {
  const POST_CONSUMER_URL = `${AMP_BACKEND_SERVER}/projects/${projectID}/groups`;
  return axios.post(POST_CONSUMER_URL, {
    GroupRef: groupId,
    GroupName: groupName,
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getUserConfig(
  userId: string,
  groupId: string,
  integrationName: string,
): Promise<IntegrationConfig> {
  // TODO: rip out mock and make network call to return real configuration object
  return sampleIntegrationConfig;
}

export async function postUserConfig(
  userId: string,
  groupId: string,
  integrationName: string,
  integrationConfig: IntegrationConfig,
): Promise<void> {
  // TODO: Replace stub with network call.
  console.log(integrationConfig); // eslint-disable-line
}
