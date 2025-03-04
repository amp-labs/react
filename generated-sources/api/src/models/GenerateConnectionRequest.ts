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
import type { GenerateConnectionRequestBasicAuth } from './GenerateConnectionRequestBasicAuth';
import {
    GenerateConnectionRequestBasicAuthFromJSON,
    GenerateConnectionRequestBasicAuthFromJSONTyped,
    GenerateConnectionRequestBasicAuthToJSON,
} from './GenerateConnectionRequestBasicAuth';
import type { GenerateConnectionRequestOauth2ClientCredentials } from './GenerateConnectionRequestOauth2ClientCredentials';
import {
    GenerateConnectionRequestOauth2ClientCredentialsFromJSON,
    GenerateConnectionRequestOauth2ClientCredentialsFromJSONTyped,
    GenerateConnectionRequestOauth2ClientCredentialsToJSON,
} from './GenerateConnectionRequestOauth2ClientCredentials';
import type { GenerateConnectionRequestOauth2Password } from './GenerateConnectionRequestOauth2Password';
import {
    GenerateConnectionRequestOauth2PasswordFromJSON,
    GenerateConnectionRequestOauth2PasswordFromJSONTyped,
    GenerateConnectionRequestOauth2PasswordToJSON,
} from './GenerateConnectionRequestOauth2Password';
import type { Oauth2AuthorizationCode } from './Oauth2AuthorizationCode';
import {
    Oauth2AuthorizationCodeFromJSON,
    Oauth2AuthorizationCodeFromJSONTyped,
    Oauth2AuthorizationCodeToJSON,
} from './Oauth2AuthorizationCode';

/**
 * 
 * @export
 * @interface GenerateConnectionRequest
 */
export interface GenerateConnectionRequest {
    /**
     * The ID of the provider workspace that this connection belongs to.
     * @type {string}
     * @memberof GenerateConnectionRequest
     */
    providerWorkspaceRef?: string;
    /**
     * The name of the user group that has access to this installation.
     * @type {string}
     * @memberof GenerateConnectionRequest
     */
    groupName?: string;
    /**
     * The ID of the user group that has access to this installation.
     * @type {string}
     * @memberof GenerateConnectionRequest
     */
    groupRef: string;
    /**
     * The name of the consumer that has access to this installation.
     * @type {string}
     * @memberof GenerateConnectionRequest
     */
    consumerName?: string;
    /**
     * The consumer reference.
     * @type {string}
     * @memberof GenerateConnectionRequest
     */
    consumerRef: string;
    /**
     * The provider name (e.g. "salesforce", "hubspot")
     * @type {string}
     * @memberof GenerateConnectionRequest
     */
    provider: string;
    /**
     * The API key to use for the connection.
     * @type {string}
     * @memberof GenerateConnectionRequest
     */
    apiKey?: string;
    /**
     * 
     * @type {GenerateConnectionRequestBasicAuth}
     * @memberof GenerateConnectionRequest
     */
    basicAuth?: GenerateConnectionRequestBasicAuth;
    /**
     * 
     * @type {GenerateConnectionRequestOauth2ClientCredentials}
     * @memberof GenerateConnectionRequest
     */
    oauth2ClientCredentials?: GenerateConnectionRequestOauth2ClientCredentials;
    /**
     * 
     * @type {GenerateConnectionRequestOauth2Password}
     * @memberof GenerateConnectionRequest
     */
    oauth2Password?: GenerateConnectionRequestOauth2Password;
    /**
     * 
     * @type {Oauth2AuthorizationCode}
     * @memberof GenerateConnectionRequest
     */
    oauth2AuthorizationCode?: Oauth2AuthorizationCode;
}

/**
 * Check if a given object implements the GenerateConnectionRequest interface.
 */
export function instanceOfGenerateConnectionRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "groupRef" in value;
    isInstance = isInstance && "consumerRef" in value;
    isInstance = isInstance && "provider" in value;

    return isInstance;
}

export function GenerateConnectionRequestFromJSON(json: any): GenerateConnectionRequest {
    return GenerateConnectionRequestFromJSONTyped(json, false);
}

export function GenerateConnectionRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): GenerateConnectionRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'providerWorkspaceRef': !exists(json, 'providerWorkspaceRef') ? undefined : json['providerWorkspaceRef'],
        'groupName': !exists(json, 'groupName') ? undefined : json['groupName'],
        'groupRef': json['groupRef'],
        'consumerName': !exists(json, 'consumerName') ? undefined : json['consumerName'],
        'consumerRef': json['consumerRef'],
        'provider': json['provider'],
        'apiKey': !exists(json, 'apiKey') ? undefined : json['apiKey'],
        'basicAuth': !exists(json, 'basicAuth') ? undefined : GenerateConnectionRequestBasicAuthFromJSON(json['basicAuth']),
        'oauth2ClientCredentials': !exists(json, 'oauth2ClientCredentials') ? undefined : GenerateConnectionRequestOauth2ClientCredentialsFromJSON(json['oauth2ClientCredentials']),
        'oauth2Password': !exists(json, 'oauth2Password') ? undefined : GenerateConnectionRequestOauth2PasswordFromJSON(json['oauth2Password']),
        'oauth2AuthorizationCode': !exists(json, 'oauth2AuthorizationCode') ? undefined : Oauth2AuthorizationCodeFromJSON(json['oauth2AuthorizationCode']),
    };
}

export function GenerateConnectionRequestToJSON(value?: GenerateConnectionRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'providerWorkspaceRef': value.providerWorkspaceRef,
        'groupName': value.groupName,
        'groupRef': value.groupRef,
        'consumerName': value.consumerName,
        'consumerRef': value.consumerRef,
        'provider': value.provider,
        'apiKey': value.apiKey,
        'basicAuth': GenerateConnectionRequestBasicAuthToJSON(value.basicAuth),
        'oauth2ClientCredentials': GenerateConnectionRequestOauth2ClientCredentialsToJSON(value.oauth2ClientCredentials),
        'oauth2Password': GenerateConnectionRequestOauth2PasswordToJSON(value.oauth2Password),
        'oauth2AuthorizationCode': Oauth2AuthorizationCodeToJSON(value.oauth2AuthorizationCode),
    };
}

