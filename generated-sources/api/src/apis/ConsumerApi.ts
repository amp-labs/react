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
  CreateConsumerRequest,
  InputValidationProblem,
} from '../models';
import {
    ApiProblemFromJSON,
    ApiProblemToJSON,
    CreateConsumerRequestFromJSON,
    CreateConsumerRequestToJSON,
    InputValidationProblemFromJSON,
    InputValidationProblemToJSON,
} from '../models';

export interface CreateConsumerOperationRequest {
    projectId: string;
    consumer: CreateConsumerRequest;
}

/**
 * ConsumerApi - interface
 * 
 * @export
 * @interface ConsumerApiInterface
 */
export interface ConsumerApiInterface {
    /**
     * 
     * @summary Create a new consumer
     * @param {string} projectId 
     * @param {CreateConsumerRequest} consumer 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ConsumerApiInterface
     */
    createConsumerRaw(requestParameters: CreateConsumerOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Create a new consumer
     */
    createConsumer(requestParameters: CreateConsumerOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

}

/**
 * 
 */
export class ConsumerApi extends runtime.BaseAPI implements ConsumerApiInterface {

    /**
     * Create a new consumer
     */
    async createConsumerRaw(requestParameters: CreateConsumerOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling createConsumer.');
        }

        if (requestParameters.consumer === null || requestParameters.consumer === undefined) {
            throw new runtime.RequiredError('consumer','Required parameter requestParameters.consumer was null or undefined when calling createConsumer.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/projects/{projectId}/consumers`.replace(`{${"projectId"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateConsumerRequestToJSON(requestParameters.consumer),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Create a new consumer
     */
    async createConsumer(requestParameters: CreateConsumerOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.createConsumerRaw(requestParameters, initOverrides);
    }

}
