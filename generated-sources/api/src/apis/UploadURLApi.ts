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
  InputValidationProblem,
  SignedUrl,
} from '../models';
import {
    ApiProblemFromJSON,
    ApiProblemToJSON,
    InputValidationProblemFromJSON,
    InputValidationProblemToJSON,
    SignedUrlFromJSON,
    SignedUrlToJSON,
} from '../models';

/**
 * UploadURLApi - interface
 * 
 * @export
 * @interface UploadURLApiInterface
 */
export interface UploadURLApiInterface {
    /**
     * 
     * @summary Generate a signed URL to upload a zip file to.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UploadURLApiInterface
     */
    generateUploadUrlRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SignedUrl>>;

    /**
     * Generate a signed URL to upload a zip file to.
     */
    generateUploadUrl(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SignedUrl>;

}

/**
 * 
 */
export class UploadURLApi extends runtime.BaseAPI implements UploadURLApiInterface {

    /**
     * Generate a signed URL to upload a zip file to.
     */
    async generateUploadUrlRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SignedUrl>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/generate-upload-url`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SignedUrlFromJSON(jsonValue));
    }

    /**
     * Generate a signed URL to upload a zip file to.
     */
    async generateUploadUrl(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SignedUrl> {
        const response = await this.generateUploadUrlRaw(initOverrides);
        return await response.value();
    }

}
