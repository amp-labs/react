/* tslint:disable */
/* eslint-disable */
/**
 * Ampersand public API
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
import type { IntegrationRead } from './IntegrationRead';
import {
    IntegrationReadFromJSON,
    IntegrationReadFromJSONTyped,
    IntegrationReadToJSON,
} from './IntegrationRead';

/**
 * 
 * @export
 * @interface Integration1
 */
export interface Integration1 {
    /**
     * 
     * @type {string}
     * @memberof Integration1
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof Integration1
     */
    displayName?: string;
    /**
     * 
     * @type {string}
     * @memberof Integration1
     */
    provider: string;
    /**
     * 
     * @type {IntegrationRead}
     * @memberof Integration1
     */
    read?: IntegrationRead;
}

/**
 * Check if a given object implements the Integration1 interface.
 */
export function instanceOfIntegration1(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "provider" in value;

    return isInstance;
}

export function Integration1FromJSON(json: any): Integration1 {
    return Integration1FromJSONTyped(json, false);
}

export function Integration1FromJSONTyped(json: any, ignoreDiscriminator: boolean): Integration1 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': json['name'],
        'displayName': !exists(json, 'displayName') ? undefined : json['displayName'],
        'provider': json['provider'],
        'read': !exists(json, 'read') ? undefined : IntegrationReadFromJSON(json['read']),
    };
}

export function Integration1ToJSON(value?: Integration1 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'displayName': value.displayName,
        'provider': value.provider,
        'read': IntegrationReadToJSON(value.read),
    };
}

