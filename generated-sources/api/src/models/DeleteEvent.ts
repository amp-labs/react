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
 * @interface DeleteEvent
 */
export interface DeleteEvent {
    /**
     * If true, the integration will subscribe to delete events.
     * @type {boolean}
     * @memberof DeleteEvent
     */
    enabled?: boolean;
}

/**
 * Check if a given object implements the DeleteEvent interface.
 */
export function instanceOfDeleteEvent(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function DeleteEventFromJSON(json: any): DeleteEvent {
    return DeleteEventFromJSONTyped(json, false);
}

export function DeleteEventFromJSONTyped(json: any, ignoreDiscriminator: boolean): DeleteEvent {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'enabled': !exists(json, 'enabled') ? undefined : json['enabled'],
    };
}

export function DeleteEventToJSON(value?: DeleteEvent | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'enabled': value.enabled,
    };
}

