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
 * @interface DefaultPeriod
 */
export interface DefaultPeriod {
    /**
     * 
     * @type {number}
     * @memberof DefaultPeriod
     */
    days?: number;
}

/**
 * Check if a given object implements the DefaultPeriod interface.
 */
export function instanceOfDefaultPeriod(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function DefaultPeriodFromJSON(json: any): DefaultPeriod {
    return DefaultPeriodFromJSONTyped(json, false);
}

export function DefaultPeriodFromJSONTyped(json: any, ignoreDiscriminator: boolean): DefaultPeriod {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'days': !exists(json, 'days') ? undefined : json['days'],
    };
}

export function DefaultPeriodToJSON(value?: DefaultPeriod | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'days': value.days,
    };
}

