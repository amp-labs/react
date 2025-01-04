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
import type { Consumer } from './Consumer';
import {
    ConsumerFromJSON,
    ConsumerFromJSONTyped,
    ConsumerToJSON,
} from './Consumer';
import type { Group } from './Group';
import {
    GroupFromJSON,
    GroupFromJSONTyped,
    GroupToJSON,
} from './Group';
import type { Oauth2AuthorizationCodeTokensOnly } from './Oauth2AuthorizationCodeTokensOnly';
import {
    Oauth2AuthorizationCodeTokensOnlyFromJSON,
    Oauth2AuthorizationCodeTokensOnlyFromJSONTyped,
    Oauth2AuthorizationCodeTokensOnlyToJSON,
} from './Oauth2AuthorizationCodeTokensOnly';
import type { ProviderApp } from './ProviderApp';
import {
    ProviderAppFromJSON,
    ProviderAppFromJSONTyped,
    ProviderAppToJSON,
} from './ProviderApp';

/**
 * 
 * @export
 * @interface Connection
 */
export interface Connection {
    /**
     * The connection ID.
     * @type {string}
     * @memberof Connection
     */
    id: string;
    /**
     * The Ampersand project ID.
     * @type {string}
     * @memberof Connection
     */
    projectId: string;
    /**
     * The SaaS provider that this Connection is for.
     * @type {string}
     * @memberof Connection
     */
    provider: string;
    /**
     * 
     * @type {ProviderApp}
     * @memberof Connection
     */
    providerApp?: ProviderApp;
    /**
     * 
     * @type {Group}
     * @memberof Connection
     */
    group: Group;
    /**
     * 
     * @type {Consumer}
     * @memberof Connection
     */
    consumer: Consumer;
    /**
     * If available, the identifier for the provider workspace (e.g. "salesforce-instance-domain")
     * @type {string}
     * @memberof Connection
     */
    providerWorkspaceRef?: string;
    /**
     * If available, the ID that Salesforce/Hubspot uses to identify this user (e.g. Salesforce has IDs in the form of https://login.salesforce.com/id/00D4x0000019CQTEA2/0054x000000orJ4AA)
     * @type {string}
     * @memberof Connection
     */
    providerConsumerRef?: string;
    /**
     * The time the connection was created.
     * @type {Date}
     * @memberof Connection
     */
    createTime: Date;
    /**
     * The time the connection was last updated.
     * @type {Date}
     * @memberof Connection
     */
    updateTime?: Date;
    /**
     * The authentication scheme used for this connection.
     * @type {string}
     * @memberof Connection
     */
    authScheme: ConnectionAuthSchemeEnum;
    /**
     * The status of the connection.
     * @type {string}
     * @memberof Connection
     */
    status: ConnectionStatusEnum;
    /**
     * 
     * @type {Oauth2AuthorizationCodeTokensOnly}
     * @memberof Connection
     */
    oauth2AuthorizationCode?: Oauth2AuthorizationCodeTokensOnly;
}


/**
 * @export
 */
export const ConnectionAuthSchemeEnum = {
    None: 'none',
    ApiKey: 'apiKey',
    Basic: 'basic',
    Oauth2AuthorizationCode: 'oauth2/authorizationCode',
    Oauth2AuthorizationCodePkce: 'oauth2/authorizationCodePKCE',
    Oauth2ClientCredentials: 'oauth2/clientCredentials',
    Oauth2Password: 'oauth2/password'
} as const;
export type ConnectionAuthSchemeEnum = typeof ConnectionAuthSchemeEnum[keyof typeof ConnectionAuthSchemeEnum];

/**
 * @export
 */
export const ConnectionStatusEnum = {
    Created: 'created',
    Working: 'working',
    BadCredentials: 'bad_credentials'
} as const;
export type ConnectionStatusEnum = typeof ConnectionStatusEnum[keyof typeof ConnectionStatusEnum];


/**
 * Check if a given object implements the Connection interface.
 */
export function instanceOfConnection(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "projectId" in value;
    isInstance = isInstance && "provider" in value;
    isInstance = isInstance && "group" in value;
    isInstance = isInstance && "consumer" in value;
    isInstance = isInstance && "createTime" in value;
    isInstance = isInstance && "authScheme" in value;
    isInstance = isInstance && "status" in value;

    return isInstance;
}

export function ConnectionFromJSON(json: any): Connection {
    return ConnectionFromJSONTyped(json, false);
}

export function ConnectionFromJSONTyped(json: any, ignoreDiscriminator: boolean): Connection {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'projectId': json['projectId'],
        'provider': json['provider'],
        'providerApp': !exists(json, 'providerApp') ? undefined : ProviderAppFromJSON(json['providerApp']),
        'group': GroupFromJSON(json['group']),
        'consumer': ConsumerFromJSON(json['consumer']),
        'providerWorkspaceRef': !exists(json, 'providerWorkspaceRef') ? undefined : json['providerWorkspaceRef'],
        'providerConsumerRef': !exists(json, 'providerConsumerRef') ? undefined : json['providerConsumerRef'],
        'createTime': (new Date(json['createTime'])),
        'updateTime': !exists(json, 'updateTime') ? undefined : (new Date(json['updateTime'])),
        'authScheme': json['authScheme'],
        'status': json['status'],
        'oauth2AuthorizationCode': !exists(json, 'oauth2AuthorizationCode') ? undefined : Oauth2AuthorizationCodeTokensOnlyFromJSON(json['oauth2AuthorizationCode']),
    };
}

export function ConnectionToJSON(value?: Connection | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'projectId': value.projectId,
        'provider': value.provider,
        'providerApp': ProviderAppToJSON(value.providerApp),
        'group': GroupToJSON(value.group),
        'consumer': ConsumerToJSON(value.consumer),
        'providerWorkspaceRef': value.providerWorkspaceRef,
        'providerConsumerRef': value.providerConsumerRef,
        'createTime': (value.createTime.toISOString()),
        'updateTime': value.updateTime === undefined ? undefined : (value.updateTime.toISOString()),
        'authScheme': value.authScheme,
        'status': value.status,
        'oauth2AuthorizationCode': Oauth2AuthorizationCodeTokensOnlyToJSON(value.oauth2AuthorizationCode),
    };
}

