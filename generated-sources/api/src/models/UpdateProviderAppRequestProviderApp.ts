/* tslint:disable */
/* eslint-disable */
/**
 * Ampersand public API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * The provider app fields to update. (Only include the fields you'd like to update.)
 * @export
 * @interface UpdateProviderAppRequestProviderApp
 */
export interface UpdateProviderAppRequestProviderApp {
    /**
     * The ID used by the provider to identify the app (optional).
     * @type {string}
     * @memberof UpdateProviderAppRequestProviderApp
     */
    externalRef?: string;
    /**
     * The SaaS provider that this app connects to.
     * @type {string}
     * @memberof UpdateProviderAppRequestProviderApp
     */
    provider?: string;
    /**
     * The OAuth client ID for this app.
     * @type {string}
     * @memberof UpdateProviderAppRequestProviderApp
     */
    clientId?: string;
    /**
     * The OAuth client secret for this app.
     * @type {string}
     * @memberof UpdateProviderAppRequestProviderApp
     */
    clientSecret?: string;
}

/**
 * Check if a given object implements the UpdateProviderAppRequestProviderApp interface.
 */
export function instanceOfUpdateProviderAppRequestProviderApp(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function UpdateProviderAppRequestProviderAppFromJSON(json: any): UpdateProviderAppRequestProviderApp {
    return UpdateProviderAppRequestProviderAppFromJSONTyped(json, false);
}

export function UpdateProviderAppRequestProviderAppFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdateProviderAppRequestProviderApp {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'externalRef': !exists(json, 'externalRef') ? undefined : json['externalRef'],
        'provider': !exists(json, 'provider') ? undefined : json['provider'],
        'clientId': !exists(json, 'clientId') ? undefined : json['clientId'],
        'clientSecret': !exists(json, 'clientSecret') ? undefined : json['clientSecret'],
    };
}

export function UpdateProviderAppRequestProviderAppToJSON(value?: UpdateProviderAppRequestProviderApp | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'externalRef': value.externalRef,
        'provider': value.provider,
        'clientId': value.clientId,
        'clientSecret': value.clientSecret,
    };
}

