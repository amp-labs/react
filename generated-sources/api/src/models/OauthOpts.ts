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
import type { TokenMetadataFields } from './TokenMetadataFields';
import {
    TokenMetadataFieldsFromJSON,
    TokenMetadataFieldsFromJSONTyped,
    TokenMetadataFieldsToJSON,
} from './TokenMetadataFields';

/**
 * 
 * @export
 * @interface OauthOpts
 */
export interface OauthOpts {
    /**
     * 
     * @type {string}
     * @memberof OauthOpts
     */
    grantType: OauthOptsGrantTypeEnum;
    /**
     * 
     * @type {string}
     * @memberof OauthOpts
     */
    authURL: string;
    /**
     * 
     * @type {string}
     * @memberof OauthOpts
     */
    tokenURL: string;
    /**
     * 
     * @type {boolean}
     * @memberof OauthOpts
     */
    explicitScopesRequired: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof OauthOpts
     */
    explicitWorkspaceRequired: boolean;
    /**
     * 
     * @type {TokenMetadataFields}
     * @memberof OauthOpts
     */
    tokenMetadataFields: TokenMetadataFields;
}


/**
 * @export
 */
export const OauthOptsGrantTypeEnum = {
    AuthorizationCode: 'authorizationCode',
    ClientCredentials: 'clientCredentials',
    Pkce: 'PKCE'
} as const;
export type OauthOptsGrantTypeEnum = typeof OauthOptsGrantTypeEnum[keyof typeof OauthOptsGrantTypeEnum];


/**
 * Check if a given object implements the OauthOpts interface.
 */
export function instanceOfOauthOpts(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "grantType" in value;
    isInstance = isInstance && "authURL" in value;
    isInstance = isInstance && "tokenURL" in value;
    isInstance = isInstance && "explicitScopesRequired" in value;
    isInstance = isInstance && "explicitWorkspaceRequired" in value;
    isInstance = isInstance && "tokenMetadataFields" in value;

    return isInstance;
}

export function OauthOptsFromJSON(json: any): OauthOpts {
    return OauthOptsFromJSONTyped(json, false);
}

export function OauthOptsFromJSONTyped(json: any, ignoreDiscriminator: boolean): OauthOpts {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'grantType': json['grantType'],
        'authURL': json['authURL'],
        'tokenURL': json['tokenURL'],
        'explicitScopesRequired': json['explicitScopesRequired'],
        'explicitWorkspaceRequired': json['explicitWorkspaceRequired'],
        'tokenMetadataFields': TokenMetadataFieldsFromJSON(json['tokenMetadataFields']),
    };
}

export function OauthOptsToJSON(value?: OauthOpts | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'grantType': value.grantType,
        'authURL': value.authURL,
        'tokenURL': value.tokenURL,
        'explicitScopesRequired': value.explicitScopesRequired,
        'explicitWorkspaceRequired': value.explicitWorkspaceRequired,
        'tokenMetadataFields': TokenMetadataFieldsToJSON(value.tokenMetadataFields),
    };
}

