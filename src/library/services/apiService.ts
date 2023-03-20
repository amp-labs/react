import axios from 'axios';
import { IntegrationConfig, IntegrationSource } from '../../components/types/configTypes';
import { sampleIntegrationConfig } from '../../testData/integrationSource';

export const AMP_BACKEND_SERVER = 'https://api.withampersand.com';
export const AMP_TEST_SERVER = 'https://oauth-server-msdauvir5a-uc.a.run.app';
const CONNECT_OAUTH_URL = `${AMP_TEST_SERVER}/connect-oauth`;

/**
 * Get all sources for a builder.
 *
 * @param projectId {string} Builder's project ID
 * @param apiKey {string} Builder's API key.
 * @returns {Promise} Then-able promise to handle success and failure from caller.
 */
export function getAllSources(projectID: string, apiKey: string) {
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

export function getUserConfig(
  source: IntegrationSource,
  subdomain: string,
  api: string,
): IntegrationConfig {
  console.log(source); // eslint-disable-line
  console.log(subdomain); // eslint-disable-line
  console.log(api); // eslint-disable-line

  // TODO: rip out mock and make network call to return real configuration object
  return sampleIntegrationConfig;
}

export function postUserConfig(integrationConfig: IntegrationConfig) {
  // TODO: Replace stub with network call.
  console.log(integrationConfig); // eslint-disable-line
}
