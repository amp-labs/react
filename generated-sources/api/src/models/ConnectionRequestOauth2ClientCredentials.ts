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
 * @interface ConnectionRequestOauth2ClientCredentials
 */
export interface ConnectionRequestOauth2ClientCredentials {
    /**
     * The client ID to use for the connection.
     * @type {string}
     * @memberof ConnectionRequestOauth2ClientCredentials
     */
    clientId: string;
    /**
     * The client secret to use for the connection.
     * @type {string}
     * @memberof ConnectionRequestOauth2ClientCredentials
     */
    clientSecret: string;
    /**
     * The scopes for the tokens.
     * @type {Array<string>}
     * @memberof ConnectionRequestOauth2ClientCredentials
     */
    scopes?: Array<string>;
}

/**
 * Check if a given object implements the ConnectionRequestOauth2ClientCredentials interface.
 */
export function instanceOfConnectionRequestOauth2ClientCredentials(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "clientId" in value;
    isInstance = isInstance && "clientSecret" in value;

    return isInstance;
}

export function ConnectionRequestOauth2ClientCredentialsFromJSON(json: any): ConnectionRequestOauth2ClientCredentials {
    return ConnectionRequestOauth2ClientCredentialsFromJSONTyped(json, false);
}

export function ConnectionRequestOauth2ClientCredentialsFromJSONTyped(json: any, ignoreDiscriminator: boolean): ConnectionRequestOauth2ClientCredentials {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'clientId': json['clientId'],
        'clientSecret': json['clientSecret'],
        'scopes': !exists(json, 'scopes') ? undefined : json['scopes'],
    };
}

export function ConnectionRequestOauth2ClientCredentialsToJSON(value?: ConnectionRequestOauth2ClientCredentials | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'clientId': value.clientId,
        'clientSecret': value.clientSecret,
        'scopes': value.scopes,
    };
}

