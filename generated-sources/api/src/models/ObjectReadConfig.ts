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
 * @interface ObjectReadConfig
 */
export interface ObjectReadConfig {
    /**
     * 
     * @type {string}
     * @memberof ObjectReadConfig
     */
    objectName: string;
    /**
     * 
     * @type {string}
     * @memberof ObjectReadConfig
     */
    destination: string;
    /**
     * This is a map of field names to booleans indicating whether they should be read.
     * @type {{ [key: string]: boolean; }}
     * @memberof ObjectReadConfig
     */
    selectedFields?: { [key: string]: boolean; };
    /**
     * This is a map of mapToNames to field names. (A mapTo name is the name the builder wants to map a field to when it lands in their destination.)
     * @type {{ [key: string]: string; }}
     * @memberof ObjectReadConfig
     */
    selectedFieldMappings?: { [key: string]: string; };
}

/**
 * Check if a given object implements the ObjectReadConfig interface.
 */
export function instanceOfObjectReadConfig(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "objectName" in value;
    isInstance = isInstance && "destination" in value;

    return isInstance;
}

export function ObjectReadConfigFromJSON(json: any): ObjectReadConfig {
    return ObjectReadConfigFromJSONTyped(json, false);
}

export function ObjectReadConfigFromJSONTyped(json: any, ignoreDiscriminator: boolean): ObjectReadConfig {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'objectName': json['objectName'],
        'destination': json['destination'],
        'selectedFields': !exists(json, 'selectedFields') ? undefined : json['selectedFields'],
        'selectedFieldMappings': !exists(json, 'selectedFieldMappings') ? undefined : json['selectedFieldMappings'],
    };
}

export function ObjectReadConfigToJSON(value?: ObjectReadConfig | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'objectName': value.objectName,
        'destination': value.destination,
        'selectedFields': value.selectedFields,
        'selectedFieldMappings': value.selectedFieldMappings,
    };
}
