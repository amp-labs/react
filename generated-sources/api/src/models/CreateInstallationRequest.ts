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
import type { CreateInstallationRequestConfig } from './CreateInstallationRequestConfig';
import {
    CreateInstallationRequestConfigFromJSON,
    CreateInstallationRequestConfigFromJSONTyped,
    CreateInstallationRequestConfigToJSON,
} from './CreateInstallationRequestConfig';

/**
 * 
 * @export
 * @interface CreateInstallationRequest
 */
export interface CreateInstallationRequest {
    /**
     * The ID of the user group that has access to this installation.
     * @type {string}
     * @memberof CreateInstallationRequest
     */
    groupRef: string;
    /**
     * The ID of the SaaS connection tied to this installation. If omitted the default connection for this group will be used.
     * @type {string}
     * @memberof CreateInstallationRequest
     */
    connectionId?: string;
    /**
     * 
     * @type {CreateInstallationRequestConfig}
     * @memberof CreateInstallationRequest
     */
    config: CreateInstallationRequestConfig;
}

/**
 * Check if a given object implements the CreateInstallationRequest interface.
 */
export function instanceOfCreateInstallationRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "groupRef" in value;
    isInstance = isInstance && "config" in value;

    return isInstance;
}

export function CreateInstallationRequestFromJSON(json: any): CreateInstallationRequest {
    return CreateInstallationRequestFromJSONTyped(json, false);
}

export function CreateInstallationRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateInstallationRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'groupRef': json['groupRef'],
        'connectionId': !exists(json, 'connectionId') ? undefined : json['connectionId'],
        'config': CreateInstallationRequestConfigFromJSON(json['config']),
    };
}

export function CreateInstallationRequestToJSON(value?: CreateInstallationRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'groupRef': value.groupRef,
        'connectionId': value.connectionId,
        'config': CreateInstallationRequestConfigToJSON(value.config),
    };
}

