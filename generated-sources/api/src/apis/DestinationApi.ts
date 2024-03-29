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
  Destination,
} from '../models';
import {
    DestinationFromJSON,
    DestinationToJSON,
} from '../models';

export interface CreateDestinationRequest {
    projectId: string;
    destination: Destination;
}

export interface GetDestinationRequest {
    projectId: string;
    destinationName: string;
}

export interface ListDestinationsRequest {
    projectId: string;
}

/**
 * DestinationApi - interface
 * 
 * @export
 * @interface DestinationApiInterface
 */
export interface DestinationApiInterface {
    /**
     * 
     * @summary Create a new destination
     * @param {string} projectId 
     * @param {Destination} destination 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DestinationApiInterface
     */
    createDestinationRaw(requestParameters: CreateDestinationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Create a new destination
     */
    createDestination(requestParameters: CreateDestinationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * 
     * @summary Get a destination
     * @param {string} projectId 
     * @param {string} destinationName 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DestinationApiInterface
     */
    getDestinationRaw(requestParameters: GetDestinationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Destination>>;

    /**
     * Get a destination
     */
    getDestination(requestParameters: GetDestinationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Destination>;

    /**
     * 
     * @summary List destinations
     * @param {string} projectId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DestinationApiInterface
     */
    listDestinationsRaw(requestParameters: ListDestinationsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Destination>>>;

    /**
     * List destinations
     */
    listDestinations(requestParameters: ListDestinationsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Destination>>;

}

/**
 * 
 */
export class DestinationApi extends runtime.BaseAPI implements DestinationApiInterface {

    /**
     * Create a new destination
     */
    async createDestinationRaw(requestParameters: CreateDestinationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling createDestination.');
        }

        if (requestParameters.destination === null || requestParameters.destination === undefined) {
            throw new runtime.RequiredError('destination','Required parameter requestParameters.destination was null or undefined when calling createDestination.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/projects/{projectId}/destinations`.replace(`{${"projectId"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: DestinationToJSON(requestParameters.destination),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Create a new destination
     */
    async createDestination(requestParameters: CreateDestinationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.createDestinationRaw(requestParameters, initOverrides);
    }

    /**
     * Get a destination
     */
    async getDestinationRaw(requestParameters: GetDestinationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Destination>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling getDestination.');
        }

        if (requestParameters.destinationName === null || requestParameters.destinationName === undefined) {
            throw new runtime.RequiredError('destinationName','Required parameter requestParameters.destinationName was null or undefined when calling getDestination.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/projects/{projectId}/destinations/{destinationName}`.replace(`{${"projectId"}}`, encodeURIComponent(String(requestParameters.projectId))).replace(`{${"destinationName"}}`, encodeURIComponent(String(requestParameters.destinationName))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DestinationFromJSON(jsonValue));
    }

    /**
     * Get a destination
     */
    async getDestination(requestParameters: GetDestinationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Destination> {
        const response = await this.getDestinationRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * List destinations
     */
    async listDestinationsRaw(requestParameters: ListDestinationsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Destination>>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling listDestinations.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/projects/{projectId}/destinations`.replace(`{${"projectId"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(DestinationFromJSON));
    }

    /**
     * List destinations
     */
    async listDestinations(requestParameters: ListDestinationsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Destination>> {
        const response = await this.listDestinationsRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
