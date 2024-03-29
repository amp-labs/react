/* eslint-disable import/no-relative-packages */
// currently not using a bundler to support alias imports
import {
  AllowedDomainApi, Configuration, ConnectionApi, ConsumerApi,
  DestinationApi, GroupApi, InstallationApi, IntegrationApi,
  OAuthApi, OperationApi, OperationLogApi, ProjectApi, ProjectMembershipApi,
  ProviderAppApi, RevisionApi, UploadURLApi,
} from '../../generated-sources/api/src';

/**
 * ApiService is a wrapper around the generated API client, which exposes
 * all generated api services as properties.
 * This allows us to inject the configuration object into every api service.
 *
 * New or legacy services need to be added or deleted here after services are generated.
 * Note: some services are not used in this repo.
 */
export class ApiService {
  public allowedDomainApi: AllowedDomainApi;

  public connectionApi: ConnectionApi;

  public consumerApi: ConsumerApi;

  public destinationApi: DestinationApi;

  public groupApi: GroupApi;

  public installationApi: InstallationApi;

  public integrationApi: IntegrationApi;

  public oAuthApi: OAuthApi;

  public operationApi: OperationApi;

  public operationLogApi: OperationLogApi;

  public projectApi: ProjectApi;

  public projectMembershipApi: ProjectMembershipApi;

  public providerAppApi: ProviderAppApi;

  public revisionApi: RevisionApi;

  public uploadURLApi: UploadURLApi;

  constructor(config: Configuration) {
    this.allowedDomainApi = new AllowedDomainApi(config);
    this.connectionApi = new ConnectionApi(config);
    this.consumerApi = new ConsumerApi(config);
    this.destinationApi = new DestinationApi(config);
    this.groupApi = new GroupApi(config);
    this.installationApi = new InstallationApi(config);
    this.integrationApi = new IntegrationApi(config);
    this.oAuthApi = new OAuthApi(config);
    this.operationApi = new OperationApi(config);
    this.operationLogApi = new OperationLogApi(config);
    this.projectApi = new ProjectApi(config);
    this.projectMembershipApi = new ProjectMembershipApi(config);
    this.providerAppApi = new ProviderAppApi(config);
    this.revisionApi = new RevisionApi(config);
    this.uploadURLApi = new UploadURLApi(config);
  }
}
