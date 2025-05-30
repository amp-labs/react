/* tslint:disable */
/* eslint-disable */
/**
 * Ampersand public API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  ApiProblem,
  CreateRevisionRequest,
  HydratedRevision,
  InputValidationProblem,
} from '../models';
import {
    ApiProblemFromJSON,
    ApiProblemToJSON,
    CreateRevisionRequestFromJSON,
    CreateRevisionRequestToJSON,
    HydratedRevisionFromJSON,
    HydratedRevisionToJSON,
    InputValidationProblemFromJSON,
    InputValidationProblemToJSON,
} from '../models';

export interface CreateRevisionOperationRequest {
    projectIdOrName: string;
    integrationId: string;
    revision: CreateRevisionRequest;
}

export interface GetHydratedRevisionRequest {
    projectIdOrName: string;
    integrationId: string;
    revisionId: string;
    connectionId: string;
}

/**
 * RevisionApi - interface
 * 
 * @export
 * @interface RevisionApiInterface
 */
export interface RevisionApiInterface {
    /**
     * 
     * @summary Create a new revision.
     * @param {string} projectIdOrName The Ampersand project ID or project name.
     * @param {string} integrationId The integration ID.
     * @param {CreateRevisionRequest} revision 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RevisionApiInterface
     */
    createRevisionRaw(requestParameters: CreateRevisionOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Create a new revision.
     */
    createRevision(requestParameters: CreateRevisionOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Hydrate a revision with information from the consumer\'s SaaS instance.
     * @summary Hydrate a revision
     * @param {string} projectIdOrName The Ampersand project ID or project name.
     * @param {string} integrationId The integration ID.
     * @param {string} revisionId The revision ID.
     * @param {string} connectionId The connection ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RevisionApiInterface
     */
    getHydratedRevisionRaw(requestParameters: GetHydratedRevisionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<HydratedRevision>>;

    /**
     * Hydrate a revision with information from the consumer\'s SaaS instance.
     * Hydrate a revision
     */
    getHydratedRevision(requestParameters: GetHydratedRevisionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HydratedRevision>;

}

/**
 * 
 */
export class RevisionApi extends runtime.BaseAPI implements RevisionApiInterface {

    /**
     * Create a new revision.
     */
    async createRevisionRaw(requestParameters: CreateRevisionOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.projectIdOrName === null || requestParameters.projectIdOrName === undefined) {
            throw new runtime.RequiredError('projectIdOrName','Required parameter requestParameters.projectIdOrName was null or undefined when calling createRevision.');
        }

        if (requestParameters.integrationId === null || requestParameters.integrationId === undefined) {
            throw new runtime.RequiredError('integrationId','Required parameter requestParameters.integrationId was null or undefined when calling createRevision.');
        }

        if (requestParameters.revision === null || requestParameters.revision === undefined) {
            throw new runtime.RequiredError('revision','Required parameter requestParameters.revision was null or undefined when calling createRevision.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-Api-Key"] = this.configuration.apiKey("X-Api-Key"); // APIKeyHeader authentication
        }

        const response = await this.request({
            path: `/projects/{projectIdOrName}/integrations/{integrationId}/revisions`.replace(`{${"projectIdOrName"}}`, encodeURIComponent(String(requestParameters.projectIdOrName))).replace(`{${"integrationId"}}`, encodeURIComponent(String(requestParameters.integrationId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateRevisionRequestToJSON(requestParameters.revision),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Create a new revision.
     */
    async createRevision(requestParameters: CreateRevisionOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.createRevisionRaw(requestParameters, initOverrides);
    }

    /**
     * Hydrate a revision with information from the consumer\'s SaaS instance.
     * Hydrate a revision
     */
    async getHydratedRevisionRaw(requestParameters: GetHydratedRevisionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<HydratedRevision>> {
        if (requestParameters.projectIdOrName === null || requestParameters.projectIdOrName === undefined) {
            throw new runtime.RequiredError('projectIdOrName','Required parameter requestParameters.projectIdOrName was null or undefined when calling getHydratedRevision.');
        }

        if (requestParameters.integrationId === null || requestParameters.integrationId === undefined) {
            throw new runtime.RequiredError('integrationId','Required parameter requestParameters.integrationId was null or undefined when calling getHydratedRevision.');
        }

        if (requestParameters.revisionId === null || requestParameters.revisionId === undefined) {
            throw new runtime.RequiredError('revisionId','Required parameter requestParameters.revisionId was null or undefined when calling getHydratedRevision.');
        }

        if (requestParameters.connectionId === null || requestParameters.connectionId === undefined) {
            throw new runtime.RequiredError('connectionId','Required parameter requestParameters.connectionId was null or undefined when calling getHydratedRevision.');
        }

        const queryParameters: any = {};

        if (requestParameters.connectionId !== undefined) {
            queryParameters['connectionId'] = requestParameters.connectionId;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-Api-Key"] = this.configuration.apiKey("X-Api-Key"); // APIKeyHeader authentication
        }

        const response = await this.request({
            path: `/projects/{projectIdOrName}/integrations/{integrationId}/revisions/{revisionId}:hydrate`.replace(`{${"projectIdOrName"}}`, encodeURIComponent(String(requestParameters.projectIdOrName))).replace(`{${"integrationId"}}`, encodeURIComponent(String(requestParameters.integrationId))).replace(`{${"revisionId"}}`, encodeURIComponent(String(requestParameters.revisionId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => HydratedRevisionFromJSON(jsonValue));
    }

    /**
     * Hydrate a revision with information from the consumer\'s SaaS instance.
     * Hydrate a revision
     */
    async getHydratedRevision(requestParameters: GetHydratedRevisionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<HydratedRevision> {
        const response = await this.getHydratedRevisionRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
