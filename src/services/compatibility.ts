/* eslint-disable max-len */
import get from 'lodash.get';
import set from 'lodash.set';

import {
  BaseReadConfigStandardObject, CreateInstallationOperationRequest, CreateInstallationRequestToJSON,
  GetHydratedRevisionRequest, HydratedIntegrationObject, HydratedIntegrationRead as LegacyHydratedIntegrationRead,
  HydratedRevision as LegacyHydratedRevision,
  HydratedRevisionFromJSON,
  Installation,
  InstallationFromJSON,
  UpdateInstallationOperationRequest,
  UpdateInstallationRequestInstallationConfig as LegacyUpdateInstallationRequestInstallationConfig,
} from '../../generated-sources/api/src';
import * as runtime from '../../generated-sources/api/src/runtime';

export type CompatHydratedIntegrationRead = LegacyHydratedIntegrationRead & {
  objects?: Array<HydratedIntegrationObject>
};

// HydratedRevision adds a `read.objects` property to the HydratedRevision interface
export type CompatHydratedRevision = LegacyHydratedRevision & {
  content: {
    read?: CompatHydratedIntegrationRead
  },
  additional?: string
};

export type CompatUpdateInstallationRequestInstallationConfig = LegacyUpdateInstallationRequestInstallationConfig & {
  content: {
    read?: {
      objects?: { [key: string]: BaseReadConfigStandardObject; }
    }
  }
};

export class CompatibilityApi extends runtime.BaseAPI {
  async getHydratedRevision(
    requestParameters: GetHydratedRevisionRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<CompatHydratedRevision> {
    const response = await this.request({
      path: '/projects/{projectId}/integrations/{integrationId}/revisions/{revisionId}:hydrate'.replace(`{${'projectId'}}`, encodeURIComponent(String(requestParameters.projectId))).replace(`{${'integrationId'}}`, encodeURIComponent(String(requestParameters.integrationId))).replace(`{${'revisionId'}}`, encodeURIComponent(String(requestParameters.revisionId))),
      method: 'GET',
      headers: {},
      query: {
        connectionId: requestParameters.connectionId,
      },
    }, initOverrides);

    const apiResponse = new runtime.JSONApiResponse(response, (jsonValue) => {
      // console.log(
      //   '==== CompatibilityApi.getHydratedRevision response',
      //   JSON.stringify(jsonValue, null, 2),
      // );
      const revision = HydratedRevisionFromJSON(jsonValue) as CompatHydratedRevision;
      // set(revision, 'additional', get(jsonValue, 'additional'));
      const objects = get(jsonValue, 'content.read.objects');
      if (objects) {
        set(revision, 'content.read.objects', objects);
      }
      // console.log('xxxxxxx revision', JSON.stringify(revision, null, 2));
      return revision;
    });
    return apiResponse.value();
  }

  // TODO: the request might need a compatible type
  async updateInstallation(requestParameters: UpdateInstallationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Installation> {
    const response = await this.request({
      path: '/projects/{projectId}/integrations/{integrationId}/installations/{installationId}'.replace(`{${'projectId'}}`, encodeURIComponent(String(requestParameters.projectId))).replace(`{${'integrationId'}}`, encodeURIComponent(String(requestParameters.integrationId))).replace(`{${'installationId'}}`, encodeURIComponent(String(requestParameters.installationId))),
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      query: {},
      body: UpdateInstallationRequestToJSON(requestParameters.installationUpdate),
    }, initOverrides);

    const apiResponse = new runtime.JSONApiResponse(response, (jsonValue) => InstallationFromJSON(jsonValue));
    return apiResponse.value();
  }

  // async createInstallation(requestParameters: CreateInstallationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Installation> {

  //   const readConfig = requestParameters.installation.config.content.read;

  //   const requestBody = CreateInstallationRequestToJSON(requestParameters.installation);
  //   const response = await this.request({
  //     path: '/projects/{projectId}/integrations/{integrationId}/installations'.replace(`{${'projectId'}}`, encodeURIComponent(String(requestParameters.projectId))).replace(`{${'integrationId'}}`, encodeURIComponent(String(requestParameters.integrationId))),
  //     method: 'POST',
  //     headers: {},
  //     query: {},
  //     body: requestBody,
  //   }, initOverrides);

  //   const apiResponse = new runtime.JSONApiResponse(response, (jsonValue) => InstallationFromJSON(jsonValue));
  //   return apiResponse.value();
  // }
}
