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
  Log,
  OperationEvent,
} from '../models';
import {
    LogFromJSON,
    LogToJSON,
    OperationEventFromJSON,
    OperationEventToJSON,
} from '../models';

export interface ListOperationEventLogsRequest {
    projectId: string;
    operationId: string;
    eventId: string;
}

export interface ListOperationEventsRequest {
    projectId: string;
    integrationId: string;
    installationId: string;
    operationId: string;
}

/**
 * OperationEventApi - interface
 * 
 * @export
 * @interface OperationEventApiInterface
 */
export interface OperationEventApiInterface {
    /**
     * 
     * @summary List logs for an operation event
     * @param {string} projectId 
     * @param {string} operationId 
     * @param {string} eventId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OperationEventApiInterface
     */
    listOperationEventLogsRaw(requestParameters: ListOperationEventLogsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Log>>>;

    /**
     * List logs for an operation event
     */
    listOperationEventLogs(requestParameters: ListOperationEventLogsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Log>>;

    /**
     * 
     * @summary List events for an operation
     * @param {string} projectId 
     * @param {string} integrationId 
     * @param {string} installationId 
     * @param {string} operationId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OperationEventApiInterface
     */
    listOperationEventsRaw(requestParameters: ListOperationEventsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<OperationEvent>>>;

    /**
     * List events for an operation
     */
    listOperationEvents(requestParameters: ListOperationEventsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<OperationEvent>>;

}

/**
 * 
 */
export class OperationEventApi extends runtime.BaseAPI implements OperationEventApiInterface {

    /**
     * List logs for an operation event
     */
    async listOperationEventLogsRaw(requestParameters: ListOperationEventLogsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Log>>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling listOperationEventLogs.');
        }

        if (requestParameters.operationId === null || requestParameters.operationId === undefined) {
            throw new runtime.RequiredError('operationId','Required parameter requestParameters.operationId was null or undefined when calling listOperationEventLogs.');
        }

        if (requestParameters.eventId === null || requestParameters.eventId === undefined) {
            throw new runtime.RequiredError('eventId','Required parameter requestParameters.eventId was null or undefined when calling listOperationEventLogs.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/projects/{projectId}/operations/{operationId}/events/{eventId}/logs`.replace(`{${"projectId"}}`, encodeURIComponent(String(requestParameters.projectId))).replace(`{${"operationId"}}`, encodeURIComponent(String(requestParameters.operationId))).replace(`{${"eventId"}}`, encodeURIComponent(String(requestParameters.eventId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(LogFromJSON));
    }

    /**
     * List logs for an operation event
     */
    async listOperationEventLogs(requestParameters: ListOperationEventLogsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Log>> {
        const response = await this.listOperationEventLogsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * List events for an operation
     */
    async listOperationEventsRaw(requestParameters: ListOperationEventsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<OperationEvent>>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling listOperationEvents.');
        }

        if (requestParameters.integrationId === null || requestParameters.integrationId === undefined) {
            throw new runtime.RequiredError('integrationId','Required parameter requestParameters.integrationId was null or undefined when calling listOperationEvents.');
        }

        if (requestParameters.installationId === null || requestParameters.installationId === undefined) {
            throw new runtime.RequiredError('installationId','Required parameter requestParameters.installationId was null or undefined when calling listOperationEvents.');
        }

        if (requestParameters.operationId === null || requestParameters.operationId === undefined) {
            throw new runtime.RequiredError('operationId','Required parameter requestParameters.operationId was null or undefined when calling listOperationEvents.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/projects/{projectId}/integrations/{integrationId}/installations/{installationId}/operations/{operationId}/events`.replace(`{${"projectId"}}`, encodeURIComponent(String(requestParameters.projectId))).replace(`{${"integrationId"}}`, encodeURIComponent(String(requestParameters.integrationId))).replace(`{${"installationId"}}`, encodeURIComponent(String(requestParameters.installationId))).replace(`{${"operationId"}}`, encodeURIComponent(String(requestParameters.operationId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(OperationEventFromJSON));
    }

    /**
     * List events for an operation
     */
    async listOperationEvents(requestParameters: ListOperationEventsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<OperationEvent>> {
        const response = await this.listOperationEventsRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
