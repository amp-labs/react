/* tslint:disable */
/* eslint-disable */
/**
 * Ampersand API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface OauthConnectRequest
 */
export interface OauthConnectRequest {
    /**
     * The identifier for the provider workspace (e.g. "salesforce-instance-domain")
     * @type {string}
     * @memberof OauthConnectRequest
     */
    providerWorkspaceRef?: string;
    /**
     * The project ID.
     * @type {string}
     * @memberof OauthConnectRequest
     */
    projectId?: string;
    /**
     * The group reference that will be used along with projectId as unique identifier.
     * @type {string}
     * @memberof OauthConnectRequest
     */
    groupRef?: string;
    /**
     * The consumer reference.
     * @type {string}
     * @memberof OauthConnectRequest
     */
    consumerRef?: string;
    /**
     * The provider app ID.
     * @type {string}
     * @memberof OauthConnectRequest
     */
    providerAppId?: string;
    /**
     * The provider that this app connects to.
     * @type {string}
     * @memberof OauthConnectRequest
     */
    provider?: string;
}

/**
 * Check if a given object implements the OauthConnectRequest interface.
 */
export function instanceOfOauthConnectRequest(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function OauthConnectRequestFromJSON(json: any): OauthConnectRequest {
    return OauthConnectRequestFromJSONTyped(json, false);
}

export function OauthConnectRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): OauthConnectRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'providerWorkspaceRef': !exists(json, 'providerWorkspaceRef') ? undefined : json['providerWorkspaceRef'],
        'projectId': !exists(json, 'projectId') ? undefined : json['projectId'],
        'groupRef': !exists(json, 'groupRef') ? undefined : json['groupRef'],
        'consumerRef': !exists(json, 'consumerRef') ? undefined : json['consumerRef'],
        'providerAppId': !exists(json, 'providerAppId') ? undefined : json['providerAppId'],
        'provider': !exists(json, 'provider') ? undefined : json['provider'],
    };
}

export function OauthConnectRequestToJSON(value?: OauthConnectRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'providerWorkspaceRef': value.providerWorkspaceRef,
        'projectId': value.projectId,
        'groupRef': value.groupRef,
        'consumerRef': value.consumerRef,
        'providerAppId': value.providerAppId,
        'provider': value.provider,
    };
}

