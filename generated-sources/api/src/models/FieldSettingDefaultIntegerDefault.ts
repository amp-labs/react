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
 * @interface FieldSettingDefaultIntegerDefault
 */
export interface FieldSettingDefaultIntegerDefault {
    /**
     * The default integer value to apply to a field
     * @type {number}
     * @memberof FieldSettingDefaultIntegerDefault
     */
    value?: number;
}

/**
 * Check if a given object implements the FieldSettingDefaultIntegerDefault interface.
 */
export function instanceOfFieldSettingDefaultIntegerDefault(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function FieldSettingDefaultIntegerDefaultFromJSON(json: any): FieldSettingDefaultIntegerDefault {
    return FieldSettingDefaultIntegerDefaultFromJSONTyped(json, false);
}

export function FieldSettingDefaultIntegerDefaultFromJSONTyped(json: any, ignoreDiscriminator: boolean): FieldSettingDefaultIntegerDefault {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'value': !exists(json, 'value') ? undefined : json['value'],
    };
}

export function FieldSettingDefaultIntegerDefaultToJSON(value?: FieldSettingDefaultIntegerDefault | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'value': value.value,
    };
}

