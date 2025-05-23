// currently not using a bundler to support alias imports
import {
  Configuration,
  ConnectionApi,
  InstallationApi,
  IntegrationApi,
  OAuthApi,
  ProjectApi,
  ProviderApi,
  ProviderAppApi,
  RevisionApi,
} from "@generated/api/src";

/**
 * ApiService is a wrapper around the generated API client, which exposes
 * all generated api services as properties.
 * This allows us to inject the configuration object into every api service.
 *
 * New or legacy services need to be added or deleted here after services are generated.
 * Note: some services are not used in this repo.
 */
export class ApiService {
  public connectionApi: ConnectionApi;

  public installationApi: InstallationApi;

  public integrationApi: IntegrationApi;

  public oAuthApi: OAuthApi;

  public projectApi: ProjectApi;

  public providerApi: ProviderApi;

  public providerAppApi: ProviderAppApi;

  public revisionApi: RevisionApi;

  constructor(config: Configuration) {
    this.connectionApi = new ConnectionApi(config);
    this.installationApi = new InstallationApi(config);
    this.integrationApi = new IntegrationApi(config);
    this.oAuthApi = new OAuthApi(config);
    this.projectApi = new ProjectApi(config);
    this.providerApi = new ProviderApi(config);
    this.providerAppApi = new ProviderAppApi(config);
    this.revisionApi = new RevisionApi(config);
  }
}
