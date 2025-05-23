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
 * @interface ConnectionRequestOauth2PasswordCredentials
 */
export interface ConnectionRequestOauth2PasswordCredentials {
    /**
     * The username to use for the connection.
     * @type {string}
     * @memberof ConnectionRequestOauth2PasswordCredentials
     */
    username: string;
    /**
     * The password to use for the connection.
     * @type {string}
     * @memberof ConnectionRequestOauth2PasswordCredentials
     */
    password: string;
    /**
     * The client ID to use for the connection.
     * @type {string}
     * @memberof ConnectionRequestOauth2PasswordCredentials
     */
    clientId: string;
    /**
     * The client secret to use for the connection.
     * @type {string}
     * @memberof ConnectionRequestOauth2PasswordCredentials
     */
    clientSecret: string;
    /**
     * The scopes for the tokens.
     * @type {Array<string>}
     * @memberof ConnectionRequestOauth2PasswordCredentials
     */
    scopes?: Array<string>;
}

/**
 * Check if a given object implements the ConnectionRequestOauth2PasswordCredentials interface.
 */
export function instanceOfConnectionRequestOauth2PasswordCredentials(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "username" in value;
    isInstance = isInstance && "password" in value;
    isInstance = isInstance && "clientId" in value;
    isInstance = isInstance && "clientSecret" in value;

    return isInstance;
}

export function ConnectionRequestOauth2PasswordCredentialsFromJSON(json: any): ConnectionRequestOauth2PasswordCredentials {
    return ConnectionRequestOauth2PasswordCredentialsFromJSONTyped(json, false);
}

export function ConnectionRequestOauth2PasswordCredentialsFromJSONTyped(json: any, ignoreDiscriminator: boolean): ConnectionRequestOauth2PasswordCredentials {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'username': json['username'],
        'password': json['password'],
        'clientId': json['clientId'],
        'clientSecret': json['clientSecret'],
        'scopes': !exists(json, 'scopes') ? undefined : json['scopes'],
    };
}

export function ConnectionRequestOauth2PasswordCredentialsToJSON(value?: ConnectionRequestOauth2PasswordCredentials | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'username': value.username,
        'password': value.password,
        'clientId': value.clientId,
        'clientSecret': value.clientSecret,
        'scopes': value.scopes,
    };
}

