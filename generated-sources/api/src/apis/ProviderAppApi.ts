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
  CreateProviderAppRequest,
  InputValidationProblem,
  ProviderApp,
  UpdateProviderAppRequest,
} from '../models';
import {
    ApiProblemFromJSON,
    ApiProblemToJSON,
    CreateProviderAppRequestFromJSON,
    CreateProviderAppRequestToJSON,
    InputValidationProblemFromJSON,
    InputValidationProblemToJSON,
    ProviderAppFromJSON,
    ProviderAppToJSON,
    UpdateProviderAppRequestFromJSON,
    UpdateProviderAppRequestToJSON,
} from '../models';

export interface CreateProviderAppOperationRequest {
    projectIdOrName: string;
    providerApp: CreateProviderAppRequest;
}

export interface DeleteProviderAppRequest {
    projectIdOrName: string;
    providerAppId: string;
}

export interface ListProviderAppsRequest {
    projectIdOrName: string;
}

export interface UpdateProviderAppOperationRequest {
    projectIdOrName: string;
    providerAppId: string;
    providerAppUpdate: UpdateProviderAppRequest;
}

/**
 * ProviderAppApi - interface
 * 
 * @export
 * @interface ProviderAppApiInterface
 */
export interface ProviderAppApiInterface {
    /**
     * 
     * @summary Create a new provider app
     * @param {string} projectIdOrName The Ampersand project ID or project name.
     * @param {CreateProviderAppRequest} providerApp 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProviderAppApiInterface
     */
    createProviderAppRaw(requestParameters: CreateProviderAppOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ProviderApp>>;

    /**
     * Create a new provider app
     */
    createProviderApp(requestParameters: CreateProviderAppOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ProviderApp>;

    /**
     * 
     * @summary Delete a provider app.
     * @param {string} projectIdOrName The Ampersand project ID or project name.
     * @param {string} providerAppId ID of the provider app, returned by the CreateProviderApp call.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProviderAppApiInterface
     */
    deleteProviderAppRaw(requestParameters: DeleteProviderAppRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Delete a provider app.
     */
    deleteProviderApp(requestParameters: DeleteProviderAppRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * 
     * @summary List provider apps
     * @param {string} projectIdOrName TThe Ampersand project ID or project name.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProviderAppApiInterface
     */
    listProviderAppsRaw(requestParameters: ListProviderAppsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<ProviderApp>>>;

    /**
     * List provider apps
     */
    listProviderApps(requestParameters: ListProviderAppsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<ProviderApp>>;

    /**
     * 
     * @summary Update a provider app
     * @param {string} projectIdOrName The Ampersand project ID or project name.
     * @param {string} providerAppId ID of the provider app, returned by the CreateProviderApp call.
     * @param {UpdateProviderAppRequest} providerAppUpdate 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProviderAppApiInterface
     */
    updateProviderAppRaw(requestParameters: UpdateProviderAppOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ProviderApp>>;

    /**
     * Update a provider app
     */
    updateProviderApp(requestParameters: UpdateProviderAppOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ProviderApp>;

}

/**
 * 
 */
export class ProviderAppApi extends runtime.BaseAPI implements ProviderAppApiInterface {

    /**
     * Create a new provider app
     */
    async createProviderAppRaw(requestParameters: CreateProviderAppOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ProviderApp>> {
        if (requestParameters.projectIdOrName === null || requestParameters.projectIdOrName === undefined) {
            throw new runtime.RequiredError('projectIdOrName','Required parameter requestParameters.projectIdOrName was null or undefined when calling createProviderApp.');
        }

        if (requestParameters.providerApp === null || requestParameters.providerApp === undefined) {
            throw new runtime.RequiredError('providerApp','Required parameter requestParameters.providerApp was null or undefined when calling createProviderApp.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-Api-Key"] = this.configuration.apiKey("X-Api-Key"); // APIKeyHeader authentication
        }

        const response = await this.request({
            path: `/projects/{projectIdOrName}/provider-apps`.replace(`{${"projectIdOrName"}}`, encodeURIComponent(String(requestParameters.projectIdOrName))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateProviderAppRequestToJSON(requestParameters.providerApp),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProviderAppFromJSON(jsonValue));
    }

    /**
     * Create a new provider app
     */
    async createProviderApp(requestParameters: CreateProviderAppOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ProviderApp> {
        const response = await this.createProviderAppRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Delete a provider app.
     */
    async deleteProviderAppRaw(requestParameters: DeleteProviderAppRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.projectIdOrName === null || requestParameters.projectIdOrName === undefined) {
            throw new runtime.RequiredError('projectIdOrName','Required parameter requestParameters.projectIdOrName was null or undefined when calling deleteProviderApp.');
        }

        if (requestParameters.providerAppId === null || requestParameters.providerAppId === undefined) {
            throw new runtime.RequiredError('providerAppId','Required parameter requestParameters.providerAppId was null or undefined when calling deleteProviderApp.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-Api-Key"] = this.configuration.apiKey("X-Api-Key"); // APIKeyHeader authentication
        }

        const response = await this.request({
            path: `/projects/{projectIdOrName}/provider-apps/{providerAppId}`.replace(`{${"projectIdOrName"}}`, encodeURIComponent(String(requestParameters.projectIdOrName))).replace(`{${"providerAppId"}}`, encodeURIComponent(String(requestParameters.providerAppId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete a provider app.
     */
    async deleteProviderApp(requestParameters: DeleteProviderAppRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteProviderAppRaw(requestParameters, initOverrides);
    }

    /**
     * List provider apps
     */
    async listProviderAppsRaw(requestParameters: ListProviderAppsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<ProviderApp>>> {
        if (requestParameters.projectIdOrName === null || requestParameters.projectIdOrName === undefined) {
            throw new runtime.RequiredError('projectIdOrName','Required parameter requestParameters.projectIdOrName was null or undefined when calling listProviderApps.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-Api-Key"] = this.configuration.apiKey("X-Api-Key"); // APIKeyHeader authentication
        }

        const response = await this.request({
            path: `/projects/{projectIdOrName}/provider-apps`.replace(`{${"projectIdOrName"}}`, encodeURIComponent(String(requestParameters.projectIdOrName))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ProviderAppFromJSON));
    }

    /**
     * List provider apps
     */
    async listProviderApps(requestParameters: ListProviderAppsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<ProviderApp>> {
        const response = await this.listProviderAppsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Update a provider app
     */
    async updateProviderAppRaw(requestParameters: UpdateProviderAppOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ProviderApp>> {
        if (requestParameters.projectIdOrName === null || requestParameters.projectIdOrName === undefined) {
            throw new runtime.RequiredError('projectIdOrName','Required parameter requestParameters.projectIdOrName was null or undefined when calling updateProviderApp.');
        }

        if (requestParameters.providerAppId === null || requestParameters.providerAppId === undefined) {
            throw new runtime.RequiredError('providerAppId','Required parameter requestParameters.providerAppId was null or undefined when calling updateProviderApp.');
        }

        if (requestParameters.providerAppUpdate === null || requestParameters.providerAppUpdate === undefined) {
            throw new runtime.RequiredError('providerAppUpdate','Required parameter requestParameters.providerAppUpdate was null or undefined when calling updateProviderApp.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-Api-Key"] = this.configuration.apiKey("X-Api-Key"); // APIKeyHeader authentication
        }

        const response = await this.request({
            path: `/projects/{projectIdOrName}/provider-apps/{providerAppId}`.replace(`{${"projectIdOrName"}}`, encodeURIComponent(String(requestParameters.projectIdOrName))).replace(`{${"providerAppId"}}`, encodeURIComponent(String(requestParameters.providerAppId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateProviderAppRequestToJSON(requestParameters.providerAppUpdate),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProviderAppFromJSON(jsonValue));
    }

    /**
     * Update a provider app
     */
    async updateProviderApp(requestParameters: UpdateProviderAppOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ProviderApp> {
        const response = await this.updateProviderAppRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
