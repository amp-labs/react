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
 * @interface UpdateConnectionRequestOauth2Password
 */
export interface UpdateConnectionRequestOauth2Password {
    /**
     * The username to use for the connection.
     * @type {string}
     * @memberof UpdateConnectionRequestOauth2Password
     */
    username: string;
    /**
     * The password to use for the connection.
     * @type {string}
     * @memberof UpdateConnectionRequestOauth2Password
     */
    password: string;
    /**
     * The client ID to use for the connection.
     * @type {string}
     * @memberof UpdateConnectionRequestOauth2Password
     */
    clientId: string;
    /**
     * The client secret to use for the connection.
     * @type {string}
     * @memberof UpdateConnectionRequestOauth2Password
     */
    clientSecret: string;
    /**
     * The scopes for the tokens.
     * @type {Array<string>}
     * @memberof UpdateConnectionRequestOauth2Password
     */
    scopes?: Array<string>;
}

/**
 * Check if a given object implements the UpdateConnectionRequestOauth2Password interface.
 */
export function instanceOfUpdateConnectionRequestOauth2Password(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "username" in value;
    isInstance = isInstance && "password" in value;
    isInstance = isInstance && "clientId" in value;
    isInstance = isInstance && "clientSecret" in value;

    return isInstance;
}

export function UpdateConnectionRequestOauth2PasswordFromJSON(json: any): UpdateConnectionRequestOauth2Password {
    return UpdateConnectionRequestOauth2PasswordFromJSONTyped(json, false);
}

export function UpdateConnectionRequestOauth2PasswordFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdateConnectionRequestOauth2Password {
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

export function UpdateConnectionRequestOauth2PasswordToJSON(value?: UpdateConnectionRequestOauth2Password | null): any {
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

