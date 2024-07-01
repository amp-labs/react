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
import type { ApiKeyOptsHeader } from './ApiKeyOptsHeader';
import {
    ApiKeyOptsHeaderFromJSON,
    ApiKeyOptsHeaderFromJSONTyped,
    ApiKeyOptsHeaderToJSON,
} from './ApiKeyOptsHeader';
import type { ApiKeyOptsQuery } from './ApiKeyOptsQuery';
import {
    ApiKeyOptsQueryFromJSON,
    ApiKeyOptsQueryFromJSONTyped,
    ApiKeyOptsQueryToJSON,
} from './ApiKeyOptsQuery';

/**
 * Configuration for API key. Must be provided if authType is apiKey.
 * @export
 * @interface ApiKeyOpts
 */
export interface ApiKeyOpts {
    /**
     * How the API key should be attached to requests.
     * @type {string}
     * @memberof ApiKeyOpts
     */
    attachmentType: ApiKeyOptsAttachmentTypeEnum;
    /**
     * 
     * @type {ApiKeyOptsQuery}
     * @memberof ApiKeyOpts
     */
    query?: ApiKeyOptsQuery;
    /**
     * 
     * @type {ApiKeyOptsHeader}
     * @memberof ApiKeyOpts
     */
    header?: ApiKeyOptsHeader;
    /**
     * URL with more information about how to get or use an API key.
     * @type {string}
     * @memberof ApiKeyOpts
     */
    docsURL?: string;
}


/**
 * @export
 */
export const ApiKeyOptsAttachmentTypeEnum = {
    Query: 'query',
    Header: 'header'
} as const;
export type ApiKeyOptsAttachmentTypeEnum = typeof ApiKeyOptsAttachmentTypeEnum[keyof typeof ApiKeyOptsAttachmentTypeEnum];


/**
 * Check if a given object implements the ApiKeyOpts interface.
 */
export function instanceOfApiKeyOpts(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "attachmentType" in value;

    return isInstance;
}

export function ApiKeyOptsFromJSON(json: any): ApiKeyOpts {
    return ApiKeyOptsFromJSONTyped(json, false);
}

export function ApiKeyOptsFromJSONTyped(json: any, ignoreDiscriminator: boolean): ApiKeyOpts {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'attachmentType': json['attachmentType'],
        'query': !exists(json, 'query') ? undefined : ApiKeyOptsQueryFromJSON(json['query']),
        'header': !exists(json, 'header') ? undefined : ApiKeyOptsHeaderFromJSON(json['header']),
        'docsURL': !exists(json, 'docsURL') ? undefined : json['docsURL'],
    };
}

export function ApiKeyOptsToJSON(value?: ApiKeyOpts | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'attachmentType': value.attachmentType,
        'query': ApiKeyOptsQueryToJSON(value.query),
        'header': ApiKeyOptsHeaderToJSON(value.header),
        'docsURL': value.docsURL,
    };
}

