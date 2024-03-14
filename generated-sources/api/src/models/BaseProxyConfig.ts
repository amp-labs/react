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
 * @interface BaseProxyConfig
 */
export interface BaseProxyConfig {
    /**
     * 
     * @type {boolean}
     * @memberof BaseProxyConfig
     */
    enabled?: boolean;
}

/**
 * Check if a given object implements the BaseProxyConfig interface.
 */
export function instanceOfBaseProxyConfig(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function BaseProxyConfigFromJSON(json: any): BaseProxyConfig {
    return BaseProxyConfigFromJSONTyped(json, false);
}

export function BaseProxyConfigFromJSONTyped(json: any, ignoreDiscriminator: boolean): BaseProxyConfig {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'enabled': !exists(json, 'enabled') ? undefined : json['enabled'],
    };
}

export function BaseProxyConfigToJSON(value?: BaseProxyConfig | null): any {
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
