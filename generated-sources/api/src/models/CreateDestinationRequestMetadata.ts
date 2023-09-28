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
 * @interface CreateDestinationRequestMetadata
 */
export interface CreateDestinationRequestMetadata {
    /**
     * Webhook URL
     * @type {string}
     * @memberof CreateDestinationRequestMetadata
     */
    url?: string;
}

/**
 * Check if a given object implements the CreateDestinationRequestMetadata interface.
 */
export function instanceOfCreateDestinationRequestMetadata(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function CreateDestinationRequestMetadataFromJSON(json: any): CreateDestinationRequestMetadata {
    return CreateDestinationRequestMetadataFromJSONTyped(json, false);
}

export function CreateDestinationRequestMetadataFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateDestinationRequestMetadata {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'url': !exists(json, 'url') ? undefined : json['url'],
    };
}

export function CreateDestinationRequestMetadataToJSON(value?: CreateDestinationRequestMetadata | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'url': value.url,
    };
}
