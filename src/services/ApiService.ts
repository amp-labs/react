/* eslint-disable import/no-relative-packages */
// currently not using a bundler to support alias imports
import {
  Configuration, ConnectionApi, ConsumerApi,
  DestinationApi, GroupApi, InstallationApi, IntegrationApi,
  OAuthApi, OperationApi, ProjectApi, ProviderApi,
  ProviderAppApi, RevisionApi, UploadURLApi,
} from '@generated/api/src';

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

  public consumerApi: ConsumerApi;

  public destinationApi: DestinationApi;

  public groupApi: GroupApi;

  public installationApi: InstallationApi;

  public integrationApi: IntegrationApi;

  public oAuthApi: OAuthApi;

  public operationApi: OperationApi;

  public projectApi: ProjectApi;

  public providerApi: ProviderApi;

  public providerAppApi: ProviderAppApi;

  public revisionApi: RevisionApi;

  public uploadURLApi: UploadURLApi;

  constructor(config: Configuration) {
    this.connectionApi = new ConnectionApi(config);
    this.consumerApi = new ConsumerApi(config);
    this.destinationApi = new DestinationApi(config);
    this.groupApi = new GroupApi(config);
    this.installationApi = new InstallationApi(config);
    this.integrationApi = new IntegrationApi(config);
    this.oAuthApi = new OAuthApi(config);
    this.operationApi = new OperationApi(config);
    this.projectApi = new ProjectApi(config);
    this.providerApi = new ProviderApi(config);
    this.providerAppApi = new ProviderAppApi(config);
    this.revisionApi = new RevisionApi(config);
    this.uploadURLApi = new UploadURLApi(config);
  }
}
