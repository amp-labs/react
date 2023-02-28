import axios from 'axios';

export const OAUTH_SERVER = 'https://oauth-server-msdauvir5a-uc.a.run.app';
const GET_ALL_SOURCES_URL = 'https://us-central1-ampersand-demo-server.cloudfunctions.net/getAllSources';
const CONNECT_OAUTH_URL = `${OAUTH_SERVER}/connect-oauth`;

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
