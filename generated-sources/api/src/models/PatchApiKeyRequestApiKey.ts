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
 * @interface PatchApiKeyRequestApiKey
 */
export interface PatchApiKeyRequestApiKey {
    /**
     * A short name for the API key.
     * @type {string}
     * @memberof PatchApiKeyRequestApiKey
     */
    label?: string;
    /**
     * Whether the API key is active.
     * @type {boolean}
     * @memberof PatchApiKeyRequestApiKey
     */
    active?: boolean;
    /**
     * The scopes for the API key.
     * @type {Array<string>}
     * @memberof PatchApiKeyRequestApiKey
     */
    scopes?: Array<string>;
}

/**
 * Check if a given object implements the PatchApiKeyRequestApiKey interface.
 */
export function instanceOfPatchApiKeyRequestApiKey(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function PatchApiKeyRequestApiKeyFromJSON(json: any): PatchApiKeyRequestApiKey {
    return PatchApiKeyRequestApiKeyFromJSONTyped(json, false);
}

export function PatchApiKeyRequestApiKeyFromJSONTyped(json: any, ignoreDiscriminator: boolean): PatchApiKeyRequestApiKey {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'label': !exists(json, 'label') ? undefined : json['label'],
        'active': !exists(json, 'active') ? undefined : json['active'],
        'scopes': !exists(json, 'scopes') ? undefined : json['scopes'],
    };
}

export function PatchApiKeyRequestApiKeyToJSON(value?: PatchApiKeyRequestApiKey | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'label': value.label,
        'active': value.active,
        'scopes': value.scopes,
    };
}

