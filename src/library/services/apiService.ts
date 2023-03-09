import axios from 'axios';
import { IntegrationConfig, IntegrationSource } from '../../components/types/configTypes';
import { getDefaultConfigForSource } from '../../utils';

export const AMP_OAUTH_SERVER = 'https://oauth-server-msdauvir5a-uc.a.run.app';
const CONNECT_OAUTH_URL = `${AMP_OAUTH_SERVER}/connect-oauth`;

const AMP_CF_SERVER = 'https://us-central1-ampersand-demo-server.cloudfunctions.net';
const GET_ALL_SOURCES_URL = `${AMP_CF_SERVER}/getAllSources`;

/**
 * Get all sources for a builder.
 *
 * @param apiKey {string} Builder's API key.
 * @param projectId {string} Builder's project ID
 * @returns {Promise} Thenable promise to handle success and failure from caller.
 */
export function getAllSources(apiKey: string, projectID: string) {
  // TODO: SEND API KEY AND PROJECT ID AS PARAMS - JUST LOG THEM FOR NOW
  console.log(apiKey); /* eslint-disable-line no-console */
  console.log(projectID); /* eslint-disable-line no-console */

  return axios.get(GET_ALL_SOURCES_URL);
}

/**
 * Connect to Ampersand OAuth server to register customer's subdomain.
 *
 * @param subdomain {string} Salesforce subdomain.
 * @param api {string} API service to connect to.
 * @param projectID {string} Builder's project ID.
 * @returns {Promise} Thenable promise to handle success and failure from caller.
 */
export function postConnectOAuth(subdomain: string, api: string, projectID: string) {
  return axios.post(CONNECT_OAUTH_URL, {
    Subdomain: subdomain,
    Api: 'salesforce',
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
  console.log(subdomain); // eslint-disable-line
  console.log(api); // eslint-disable-line

  // TODO: rip out stub and make network call to return real configuration object
  return getDefaultConfigForSource(source.objects);
}

export function postUserConfig(integrationConfig: IntegrationConfig) {
  console.log(integrationConfig); // eslint-disable-line
  // TODO: Replace stub with network call.
}
