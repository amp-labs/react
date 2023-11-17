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
 * @interface IntegrationWriteObject
 */
export interface IntegrationWriteObject {
    /**
     * 
     * @type {string}
     * @memberof IntegrationWriteObject
     */
    objectName: string;
}

/**
 * Check if a given object implements the IntegrationWriteObject interface.
 */
export function instanceOfIntegrationWriteObject(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "objectName" in value;

    return isInstance;
}

export function IntegrationWriteObjectFromJSON(json: any): IntegrationWriteObject {
    return IntegrationWriteObjectFromJSONTyped(json, false);
}

export function IntegrationWriteObjectFromJSONTyped(json: any, ignoreDiscriminator: boolean): IntegrationWriteObject {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'objectName': json['objectName'],
    };
}

export function IntegrationWriteObjectToJSON(value?: IntegrationWriteObject | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'objectName': value.objectName,
    };
}
