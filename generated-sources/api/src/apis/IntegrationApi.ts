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
  BatchUpsertIntegrationsRequest,
  CreateIntegrationRequest,
  Integration,
} from '../models';
import {
    BatchUpsertIntegrationsRequestFromJSON,
    BatchUpsertIntegrationsRequestToJSON,
    CreateIntegrationRequestFromJSON,
    CreateIntegrationRequestToJSON,
    IntegrationFromJSON,
    IntegrationToJSON,
} from '../models';

export interface BatchUpsertIntegrationsOperationRequest {
    projectId: string;
    batchUpsertIntegrationsRequest?: BatchUpsertIntegrationsRequest;
}

export interface CreateIntegrationOperationRequest {
    projectId: string;
    integration: CreateIntegrationRequest;
}

export interface DeleteIntegrationRequest {
    projectId: string;
    integrationId: string;
}

export interface ListIntegrationsRequest {
    projectId: string;
}

/**
 * IntegrationApi - interface
 * 
 * @export
 * @interface IntegrationApiInterface
 */
export interface IntegrationApiInterface {
    /**
     * 
     * @summary Batch upsert a group of integrations
     * @param {string} projectId 
     * @param {BatchUpsertIntegrationsRequest} [batchUpsertIntegrationsRequest] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof IntegrationApiInterface
     */
    batchUpsertIntegrationsRaw(requestParameters: BatchUpsertIntegrationsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Integration>>>;

    /**
     * Batch upsert a group of integrations
     */
    batchUpsertIntegrations(requestParameters: BatchUpsertIntegrationsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Integration>>;

    /**
     * 
     * @summary Create a new integration
     * @param {string} projectId 
     * @param {CreateIntegrationRequest} integration 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof IntegrationApiInterface
     */
    createIntegrationRaw(requestParameters: CreateIntegrationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Create a new integration
     */
    createIntegration(requestParameters: CreateIntegrationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * 
     * @summary Delete an integration
     * @param {string} projectId 
     * @param {string} integrationId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof IntegrationApiInterface
     */
    deleteIntegrationRaw(requestParameters: DeleteIntegrationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Delete an integration
     */
    deleteIntegration(requestParameters: DeleteIntegrationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * 
     * @summary List integrations
     * @param {string} projectId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof IntegrationApiInterface
     */
    listIntegrationsRaw(requestParameters: ListIntegrationsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Integration>>>;

    /**
     * List integrations
     */
    listIntegrations(requestParameters: ListIntegrationsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Integration>>;

}

/**
 * 
 */
export class IntegrationApi extends runtime.BaseAPI implements IntegrationApiInterface {

    /**
     * Batch upsert a group of integrations
     */
    async batchUpsertIntegrationsRaw(requestParameters: BatchUpsertIntegrationsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Integration>>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling batchUpsertIntegrations.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/projects/{projectId}/integrations:batch`.replace(`{${"projectId"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: BatchUpsertIntegrationsRequestToJSON(requestParameters.batchUpsertIntegrationsRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(IntegrationFromJSON));
    }

    /**
     * Batch upsert a group of integrations
     */
    async batchUpsertIntegrations(requestParameters: BatchUpsertIntegrationsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Integration>> {
        const response = await this.batchUpsertIntegrationsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Create a new integration
     */
    async createIntegrationRaw(requestParameters: CreateIntegrationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling createIntegration.');
        }

        if (requestParameters.integration === null || requestParameters.integration === undefined) {
            throw new runtime.RequiredError('integration','Required parameter requestParameters.integration was null or undefined when calling createIntegration.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/projects/{projectId}/integrations`.replace(`{${"projectId"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateIntegrationRequestToJSON(requestParameters.integration),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Create a new integration
     */
    async createIntegration(requestParameters: CreateIntegrationOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.createIntegrationRaw(requestParameters, initOverrides);
    }

    /**
     * Delete an integration
     */
    async deleteIntegrationRaw(requestParameters: DeleteIntegrationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling deleteIntegration.');
        }

        if (requestParameters.integrationId === null || requestParameters.integrationId === undefined) {
            throw new runtime.RequiredError('integrationId','Required parameter requestParameters.integrationId was null or undefined when calling deleteIntegration.');
        }

        const queryParameters: any = {};

        if (requestParameters.integrationId !== undefined) {
            queryParameters['integrationId'] = requestParameters.integrationId;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/projects/{projectId}/integrations`.replace(`{${"projectId"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete an integration
     */
    async deleteIntegration(requestParameters: DeleteIntegrationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteIntegrationRaw(requestParameters, initOverrides);
    }

    /**
     * List integrations
     */
    async listIntegrationsRaw(requestParameters: ListIntegrationsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Integration>>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling listIntegrations.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/projects/{projectId}/integrations`.replace(`{${"projectId"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(IntegrationFromJSON));
    }

    /**
     * List integrations
     */
    async listIntegrations(requestParameters: ListIntegrationsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Integration>> {
        const response = await this.listIntegrationsRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
