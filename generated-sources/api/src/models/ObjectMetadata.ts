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
 * @interface ObjectMetadata
 */
export interface ObjectMetadata {
    /**
     * Name of the object
     * @type {string}
     * @memberof ObjectMetadata
     */
    name: string;
    /**
     * Human-readable name of the object
     * @type {string}
     * @memberof ObjectMetadata
     */
    displayName?: string;
    /**
     * Map of field metadata keyed by field name
     * @type {{ [key: string]: object; }}
     * @memberof ObjectMetadata
     */
    fields: { [key: string]: object; };
}

/**
 * Check if a given object implements the ObjectMetadata interface.
 */
export function instanceOfObjectMetadata(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "fields" in value;

    return isInstance;
}

export function ObjectMetadataFromJSON(json: any): ObjectMetadata {
    return ObjectMetadataFromJSONTyped(json, false);
}

export function ObjectMetadataFromJSONTyped(json: any, ignoreDiscriminator: boolean): ObjectMetadata {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': json['name'],
        'displayName': !exists(json, 'displayName') ? undefined : json['displayName'],
        'fields': json['fields'],
    };
}

export function ObjectMetadataToJSON(value?: ObjectMetadata | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'displayName': value.displayName,
        'fields': value.fields,
    };
}

