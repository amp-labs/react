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
 * Represents a field value
 * @export
 * @interface FieldValue
 */
export interface FieldValue {
    /**
     * The internal value used by the system
     * @type {string}
     * @memberof FieldValue
     */
    value: string;
    /**
     * The human-readable display value
     * @type {string}
     * @memberof FieldValue
     */
    displayValue: string;
}

/**
 * Check if a given object implements the FieldValue interface.
 */
export function instanceOfFieldValue(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "value" in value;
    isInstance = isInstance && "displayValue" in value;

    return isInstance;
}

export function FieldValueFromJSON(json: any): FieldValue {
    return FieldValueFromJSONTyped(json, false);
}

export function FieldValueFromJSONTyped(json: any, ignoreDiscriminator: boolean): FieldValue {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'value': json['value'],
        'displayValue': json['displayValue'],
    };
}

export function FieldValueToJSON(value?: FieldValue | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'value': value.value,
        'displayValue': value.displayValue,
    };
}

