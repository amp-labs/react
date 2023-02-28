import axios from 'axios';

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
  const getAllSourcesURL = 'https://us-central1-ampersand-demo-server.cloudfunctions.net/getAllSources';

  return axios.get(getAllSourcesURL);
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
  const AMP_OAUTH_URL = 'https://oauth-server-msdauvir5a-uc.a.run.app/connect-oauth';

  return axios.post(AMP_OAUTH_URL, {
    Subdomain: subdomain,
    Api: 'salesforce',
    ProjectId: projectID,
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
