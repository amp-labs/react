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
import type { CreateDestinationRequestMetadata } from './CreateDestinationRequestMetadata';
import {
    CreateDestinationRequestMetadataFromJSON,
    CreateDestinationRequestMetadataFromJSONTyped,
    CreateDestinationRequestMetadataToJSON,
} from './CreateDestinationRequestMetadata';

/**
 * 
 * @export
 * @interface CreateDestinationRequest
 */
export interface CreateDestinationRequest {
    /**
     * User-friendly name for the destination
     * @type {string}
     * @memberof CreateDestinationRequest
     */
    name: string;
    /**
     * The type of the destination
     * @type {string}
     * @memberof CreateDestinationRequest
     */
    type: string;
    /**
     * 
     * @type {CreateDestinationRequestMetadata}
     * @memberof CreateDestinationRequest
     */
    metadata: CreateDestinationRequestMetadata;
}

/**
 * Check if a given object implements the CreateDestinationRequest interface.
 */
export function instanceOfCreateDestinationRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "type" in value;
    isInstance = isInstance && "metadata" in value;

    return isInstance;
}

export function CreateDestinationRequestFromJSON(json: any): CreateDestinationRequest {
    return CreateDestinationRequestFromJSONTyped(json, false);
}

export function CreateDestinationRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateDestinationRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': json['name'],
        'type': json['type'],
        'metadata': CreateDestinationRequestMetadataFromJSON(json['metadata']),
    };
}

export function CreateDestinationRequestToJSON(value?: CreateDestinationRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'type': value.type,
        'metadata': CreateDestinationRequestMetadataToJSON(value.metadata),
    };
}

