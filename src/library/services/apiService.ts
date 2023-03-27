/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { IntegrationConfig, IntegrationSource } from '../../components/types/configTypes';
import { sampleIntegrationConfig } from '../../testData/integrationSource';

export const AMP_BACKEND_SERVER = 'https://api.withampersand.com';
const CONNECT_OAUTH_URL = `${AMP_BACKEND_SERVER}/oauth-connect`;

/**
 * Get all sources for a builder.
 *
 * @param projectId {string} Builder's project ID
 * @param apiKey {string} Builder's API key.
 * @returns {Promise} Then-able promise to handle success and failure from caller.
 */
export async function getAllSources(projectID: string, apiKey: string) {
  return axios.get(
    `${AMP_BACKEND_SERVER}/projects/${projectID}/sources?key=${apiKey}`,
  );
}

/**
 * Connect to Ampersand OAuth server to register customer's subdomain.
 *
 * @param subdomain {string} Salesforce subdomain.
 * @param api {string} API service to connect to.
 * @param projectID {string} Builder's project ID.
 * @returns {Promise} Await-able promise to handle success and failure from caller.
 */
export async function postConnectOAuth(subdomain: string, api: string, projectID: string) {
  return axios.post(CONNECT_OAUTH_URL, {
    Subdomain: subdomain,
    Api: api,
    ProjectId: projectID,
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
