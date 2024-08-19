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
import type { ApiKeyAsBasicOpts } from './ApiKeyAsBasicOpts';
import {
    ApiKeyAsBasicOptsFromJSON,
    ApiKeyAsBasicOptsFromJSONTyped,
    ApiKeyAsBasicOptsToJSON,
} from './ApiKeyAsBasicOpts';

/**
 * Configuration for Basic Auth. Optional.
 * @export
 * @interface BasicAuthOpts
 */
export interface BasicAuthOpts {
    /**
     * If true, the provider uses an API key which then gets encoded as a basic auth user:pass string.
     * @type {boolean}
     * @memberof BasicAuthOpts
     */
    apiKeyAsBasic?: boolean;
    /**
     * 
     * @type {ApiKeyAsBasicOpts}
     * @memberof BasicAuthOpts
     */
    apiKeyAsBasicOpts?: ApiKeyAsBasicOpts;
    /**
     * URL with more information about how to get or use an API key.
     * @type {string}
     * @memberof BasicAuthOpts
     */
    docsURL?: string;
}

/**
 * Check if a given object implements the BasicAuthOpts interface.
 */
export function instanceOfBasicAuthOpts(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function BasicAuthOptsFromJSON(json: any): BasicAuthOpts {
    return BasicAuthOptsFromJSONTyped(json, false);
}

export function BasicAuthOptsFromJSONTyped(json: any, ignoreDiscriminator: boolean): BasicAuthOpts {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'apiKeyAsBasic': !exists(json, 'apiKeyAsBasic') ? undefined : json['apiKeyAsBasic'],
        'apiKeyAsBasicOpts': !exists(json, 'apiKeyAsBasicOpts') ? undefined : ApiKeyAsBasicOptsFromJSON(json['apiKeyAsBasicOpts']),
        'docsURL': !exists(json, 'docsURL') ? undefined : json['docsURL'],
    };
}

export function BasicAuthOptsToJSON(value?: BasicAuthOpts | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'apiKeyAsBasic': value.apiKeyAsBasic,
        'apiKeyAsBasicOpts': ApiKeyAsBasicOptsToJSON(value.apiKeyAsBasicOpts),
        'docsURL': value.docsURL,
    };
}

