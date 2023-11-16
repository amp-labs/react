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
 * @interface ConfigContent
 */
export interface ConfigContent {
    /**
     * The SaaS API that we are integrating with.
     * @type {string}
     * @memberof ConfigContent
     */
    provider: string;
    /**
     * 
     * @type {any}
     * @memberof ConfigContent
     */
    read?: any | null;
    /**
     * 
     * @type {any}
     * @memberof ConfigContent
     */
    write?: any | null;
}

/**
 * Check if a given object implements the ConfigContent interface.
 */
export function instanceOfConfigContent(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "provider" in value;

    return isInstance;
}

export function ConfigContentFromJSON(json: any): ConfigContent {
    return ConfigContentFromJSONTyped(json, false);
}

export function ConfigContentFromJSONTyped(json: any, ignoreDiscriminator: boolean): ConfigContent {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'provider': json['provider'],
        'read': !exists(json, 'read') ? undefined : json['read'],
        'write': !exists(json, 'write') ? undefined : json['write'],
    };
}

export function ConfigContentToJSON(value?: ConfigContent | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'provider': value.provider,
        'read': value.read,
        'write': value.write,
    };
}

