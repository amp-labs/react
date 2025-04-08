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
  ProviderInfo,
} from '../models';
import {
    ApiProblemFromJSON,
    ApiProblemToJSON,
    ProviderInfoFromJSON,
    ProviderInfoToJSON,
} from '../models';

export interface GetProviderRequest {
    provider: string;
}

/**
 * ProviderApi - interface
 * 
 * @export
 * @interface ProviderApiInterface
 */
export interface ProviderApiInterface {
    /**
     * 
     * @summary Get provider
     * @param {string} provider The API provider.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProviderApiInterface
     */
    getProviderRaw(requestParameters: GetProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ProviderInfo>>;

    /**
     * Get provider
     */
    getProvider(requestParameters: GetProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ProviderInfo>;

    /**
     * 
     * @summary List providers
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProviderApiInterface
     */
    listProvidersRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<{ [key: string]: ProviderInfo; }>>;

    /**
     * List providers
     */
    listProviders(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<{ [key: string]: ProviderInfo; }>;

}

/**
 * 
 */
export class ProviderApi extends runtime.BaseAPI implements ProviderApiInterface {

    /**
     * Get provider
     */
    async getProviderRaw(requestParameters: GetProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ProviderInfo>> {
        if (requestParameters.provider === null || requestParameters.provider === undefined) {
            throw new runtime.RequiredError('provider','Required parameter requestParameters.provider was null or undefined when calling getProvider.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-Api-Key"] = this.configuration.apiKey("X-Api-Key"); // APIKeyHeader authentication
        }

        const response = await this.request({
            path: `/providers/{provider}`.replace(`{${"provider"}}`, encodeURIComponent(String(requestParameters.provider))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProviderInfoFromJSON(jsonValue));
    }

    /**
     * Get provider
     */
    async getProvider(requestParameters: GetProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ProviderInfo> {
        const response = await this.getProviderRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * List providers
     */
    async listProvidersRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<{ [key: string]: ProviderInfo; }>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-Api-Key"] = this.configuration.apiKey("X-Api-Key"); // APIKeyHeader authentication
        }

        const response = await this.request({
            path: `/providers`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => runtime.mapValues(jsonValue, ProviderInfoFromJSON));
    }

    /**
     * List providers
     */
    async listProviders(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<{ [key: string]: ProviderInfo; }> {
        const response = await this.listProvidersRaw(initOverrides);
        return await response.value();
    }

}
