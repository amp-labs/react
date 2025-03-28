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
import type { Oauth2AuthorizationCodeTokensOnlyAccessToken } from './Oauth2AuthorizationCodeTokensOnlyAccessToken';
import {
    Oauth2AuthorizationCodeTokensOnlyAccessTokenFromJSON,
    Oauth2AuthorizationCodeTokensOnlyAccessTokenFromJSONTyped,
    Oauth2AuthorizationCodeTokensOnlyAccessTokenToJSON,
} from './Oauth2AuthorizationCodeTokensOnlyAccessToken';
import type { Oauth2AuthorizationCodeTokensOnlyRefreshToken } from './Oauth2AuthorizationCodeTokensOnlyRefreshToken';
import {
    Oauth2AuthorizationCodeTokensOnlyRefreshTokenFromJSON,
    Oauth2AuthorizationCodeTokensOnlyRefreshTokenFromJSONTyped,
    Oauth2AuthorizationCodeTokensOnlyRefreshTokenToJSON,
} from './Oauth2AuthorizationCodeTokensOnlyRefreshToken';

/**
 * 
 * @export
 * @interface Oauth2AuthorizationCodeTokensOnly
 */
export interface Oauth2AuthorizationCodeTokensOnly {
    /**
     * 
     * @type {Oauth2AuthorizationCodeTokensOnlyAccessToken}
     * @memberof Oauth2AuthorizationCodeTokensOnly
     */
    accessToken?: Oauth2AuthorizationCodeTokensOnlyAccessToken;
    /**
     * 
     * @type {Oauth2AuthorizationCodeTokensOnlyRefreshToken}
     * @memberof Oauth2AuthorizationCodeTokensOnly
     */
    refreshToken?: Oauth2AuthorizationCodeTokensOnlyRefreshToken;
    /**
     * The scopes for the tokens.
     * @type {Array<string>}
     * @memberof Oauth2AuthorizationCodeTokensOnly
     */
    scopes?: Array<string>;
}

/**
 * Check if a given object implements the Oauth2AuthorizationCodeTokensOnly interface.
 */
export function instanceOfOauth2AuthorizationCodeTokensOnly(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function Oauth2AuthorizationCodeTokensOnlyFromJSON(json: any): Oauth2AuthorizationCodeTokensOnly {
    return Oauth2AuthorizationCodeTokensOnlyFromJSONTyped(json, false);
}

export function Oauth2AuthorizationCodeTokensOnlyFromJSONTyped(json: any, ignoreDiscriminator: boolean): Oauth2AuthorizationCodeTokensOnly {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'accessToken': !exists(json, 'accessToken') ? undefined : Oauth2AuthorizationCodeTokensOnlyAccessTokenFromJSON(json['accessToken']),
        'refreshToken': !exists(json, 'refreshToken') ? undefined : Oauth2AuthorizationCodeTokensOnlyRefreshTokenFromJSON(json['refreshToken']),
        'scopes': !exists(json, 'scopes') ? undefined : json['scopes'],
    };
}

export function Oauth2AuthorizationCodeTokensOnlyToJSON(value?: Oauth2AuthorizationCodeTokensOnly | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'accessToken': Oauth2AuthorizationCodeTokensOnlyAccessTokenToJSON(value.accessToken),
        'refreshToken': Oauth2AuthorizationCodeTokensOnlyRefreshTokenToJSON(value.refreshToken),
        'scopes': value.scopes,
    };
}

