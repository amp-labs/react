/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { IntegrationConfig } from '../types/configTypes';
import { TestSourceList, sampleIntegrationConfig } from '../testData/integrationSource';

export const AMP_BACKEND_SERVER = process.env.REACT_APP_AMP_SERVER === 'local'
  ? 'http://localhost:8080'
  : 'https://api.withampersand.com';
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
    GroupRef: 'p0-g1-ref',
    ConsumerRef: 'consumerRef:p0-c1',
    ProviderAppId: '85401a99-9395-4929-b57f-32da59048f2e',
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
