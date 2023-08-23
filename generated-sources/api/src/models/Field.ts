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
 * @interface Field
 */
export interface Field {
    /**
     * 
     * @type {string}
     * @memberof Field
     */
    fieldName?: string;
    /**
     * 
     * @type {string}
     * @memberof Field
     */
    prompt?: string;
}

/**
 * Check if a given object implements the Field interface.
 */
export function instanceOfField(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function FieldFromJSON(json: any): Field {
    return FieldFromJSONTyped(json, false);
}

export function FieldFromJSONTyped(json: any, ignoreDiscriminator: boolean): Field {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'fieldName': !exists(json, 'fieldName') ? undefined : json['fieldName'],
        'prompt': !exists(json, 'prompt') ? undefined : json['prompt'],
    };
}

export function FieldToJSON(value?: Field | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'fieldName': value.fieldName,
        'prompt': value.prompt,
    };
}

