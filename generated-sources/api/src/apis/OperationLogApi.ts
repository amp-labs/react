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
  OperationLog,
} from '../models';
import {
    OperationLogFromJSON,
    OperationLogToJSON,
} from '../models';

export interface ListOperationLogsRequest {
    projectId: string;
    operationId: string;
}

/**
 * OperationLogApi - interface
 * 
 * @export
 * @interface OperationLogApiInterface
 */
export interface OperationLogApiInterface {
    /**
     * List logs for an operation, earliest first.
     * @summary List logs for an operation
     * @param {string} projectId 
     * @param {string} operationId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OperationLogApiInterface
     */
    listOperationLogsRaw(requestParameters: ListOperationLogsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<OperationLog>>>;

    /**
     * List logs for an operation, earliest first.
     * List logs for an operation
     */
    listOperationLogs(requestParameters: ListOperationLogsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<OperationLog>>;

}

/**
 * 
 */
export class OperationLogApi extends runtime.BaseAPI implements OperationLogApiInterface {

    /**
     * List logs for an operation, earliest first.
     * List logs for an operation
     */
    async listOperationLogsRaw(requestParameters: ListOperationLogsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<OperationLog>>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling listOperationLogs.');
        }

        if (requestParameters.operationId === null || requestParameters.operationId === undefined) {
            throw new runtime.RequiredError('operationId','Required parameter requestParameters.operationId was null or undefined when calling listOperationLogs.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/projects/{projectId}/operations/{operationId}/logs`.replace(`{${"projectId"}}`, encodeURIComponent(String(requestParameters.projectId))).replace(`{${"operationId"}}`, encodeURIComponent(String(requestParameters.operationId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(OperationLogFromJSON));
    }

    /**
     * List logs for an operation, earliest first.
     * List logs for an operation
     */
    async listOperationLogs(requestParameters: ListOperationLogsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<OperationLog>> {
        const response = await this.listOperationLogsRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
