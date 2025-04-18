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
import type { ConnectionRequest } from './ConnectionRequest';
import {
    ConnectionRequestFromJSON,
    ConnectionRequestFromJSONTyped,
    ConnectionRequestToJSON,
} from './ConnectionRequest';

/**
 * 
 * @export
 * @interface UpdateConnectionRequest
 */
export interface UpdateConnectionRequest {
    /**
     * The fields to update.
     * @type {Array<string>}
     * @memberof UpdateConnectionRequest
     */
    updateMask: Array<string>;
    /**
     * 
     * @type {ConnectionRequest}
     * @memberof UpdateConnectionRequest
     */
    connection: ConnectionRequest;
}

/**
 * Check if a given object implements the UpdateConnectionRequest interface.
 */
export function instanceOfUpdateConnectionRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "updateMask" in value;
    isInstance = isInstance && "connection" in value;

    return isInstance;
}

export function UpdateConnectionRequestFromJSON(json: any): UpdateConnectionRequest {
    return UpdateConnectionRequestFromJSONTyped(json, false);
}

export function UpdateConnectionRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdateConnectionRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'updateMask': json['updateMask'],
        'connection': ConnectionRequestFromJSON(json['connection']),
    };
}

export function UpdateConnectionRequestToJSON(value?: UpdateConnectionRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'updateMask': value.updateMask,
        'connection': ConnectionRequestToJSON(value.connection),
    };
}

