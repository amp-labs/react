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
  OauthConnectRequest,
} from '../models';
import {
    ApiProblemFromJSON,
    ApiProblemToJSON,
    InputValidationProblemFromJSON,
    InputValidationProblemToJSON,
    OauthConnectRequestFromJSON,
    OauthConnectRequestToJSON,
} from '../models';

export interface OauthConnectOperationRequest {
    connectOAuthParams: OauthConnectRequest;
}

/**
 * OAuthApi - interface
 * 
 * @export
 * @interface OAuthApiInterface
 */
export interface OAuthApiInterface {
    /**
     * Generate a URL for the browser to render to kick off OAuth flow.
     * @summary Get URL for OAuth flow
     * @param {OauthConnectRequest} connectOAuthParams 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OAuthApiInterface
     */
    oauthConnectRaw(requestParameters: OauthConnectOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>>;

    /**
     * Generate a URL for the browser to render to kick off OAuth flow.
     * Get URL for OAuth flow
     */
    oauthConnect(requestParameters: OauthConnectOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string>;

}

/**
 * 
 */
export class OAuthApi extends runtime.BaseAPI implements OAuthApiInterface {

    /**
     * Generate a URL for the browser to render to kick off OAuth flow.
     * Get URL for OAuth flow
     */
    async oauthConnectRaw(requestParameters: OauthConnectOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        if (requestParameters.connectOAuthParams === null || requestParameters.connectOAuthParams === undefined) {
            throw new runtime.RequiredError('connectOAuthParams','Required parameter requestParameters.connectOAuthParams was null or undefined when calling oauthConnect.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/oauth-connect`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: OauthConnectRequestToJSON(requestParameters.connectOAuthParams),
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * Generate a URL for the browser to render to kick off OAuth flow.
     * Get URL for OAuth flow
     */
    async oauthConnect(requestParameters: OauthConnectOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.oauthConnectRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
