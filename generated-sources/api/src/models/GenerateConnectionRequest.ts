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

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface GenerateConnectionRequest
 */
export interface GenerateConnectionRequest {
    /**
     * The ID of the project that this connection belongs to.
     * @type {string}
     * @memberof GenerateConnectionRequest
     */
    projectId: string;
    /**
     * The ID of the provider workspace that this connection belongs to.
     * @type {string}
     * @memberof GenerateConnectionRequest
     */
    providerWorkspaceRef?: string;
    /**
     * The name of the user group that has access to this installation.
     * @type {string}
     * @memberof GenerateConnectionRequest
     */
    groupName?: string;
    /**
     * The ID of the user group that has access to this installation.
     * @type {string}
     * @memberof GenerateConnectionRequest
     */
    groupRef: string;
    /**
     * The name of the consumer that has access to this installation.
     * @type {string}
     * @memberof GenerateConnectionRequest
     */
    consumerName?: string;
    /**
     * The consumer reference.
     * @type {string}
     * @memberof GenerateConnectionRequest
     */
    consumerRef: string;
    /**
     * The provider name (e.g. "salesforce", "hubspot")
     * @type {string}
     * @memberof GenerateConnectionRequest
     */
    provider: string;
}

/**
 * Check if a given object implements the GenerateConnectionRequest interface.
 */
export function instanceOfGenerateConnectionRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "projectId" in value;
    isInstance = isInstance && "groupRef" in value;
    isInstance = isInstance && "consumerRef" in value;
    isInstance = isInstance && "provider" in value;

    return isInstance;
}

export function GenerateConnectionRequestFromJSON(json: any): GenerateConnectionRequest {
    return GenerateConnectionRequestFromJSONTyped(json, false);
}

export function GenerateConnectionRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): GenerateConnectionRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'projectId': json['projectId'],
        'providerWorkspaceRef': !exists(json, 'providerWorkspaceRef') ? undefined : json['providerWorkspaceRef'],
        'groupName': !exists(json, 'groupName') ? undefined : json['groupName'],
        'groupRef': json['groupRef'],
        'consumerName': !exists(json, 'consumerName') ? undefined : json['consumerName'],
        'consumerRef': json['consumerRef'],
        'provider': json['provider'],
    };
}

export function GenerateConnectionRequestToJSON(value?: GenerateConnectionRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'projectId': value.projectId,
        'providerWorkspaceRef': value.providerWorkspaceRef,
        'groupName': value.groupName,
        'groupRef': value.groupRef,
        'consumerName': value.consumerName,
        'consumerRef': value.consumerRef,
        'provider': value.provider,
    };
}
