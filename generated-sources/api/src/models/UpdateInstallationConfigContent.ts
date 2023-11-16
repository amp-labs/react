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
import type { BaseReadConfig } from './BaseReadConfig';
import {
    BaseReadConfigFromJSON,
    BaseReadConfigFromJSONTyped,
    BaseReadConfigToJSON,
} from './BaseReadConfig';
import type { BaseWriteConfig } from './BaseWriteConfig';
import {
    BaseWriteConfigFromJSON,
    BaseWriteConfigFromJSONTyped,
    BaseWriteConfigToJSON,
} from './BaseWriteConfig';

/**
 * 
 * @export
 * @interface UpdateInstallationConfigContent
 */
export interface UpdateInstallationConfigContent {
    /**
     * The SaaS API that we are integrating with.
     * @type {string}
     * @memberof UpdateInstallationConfigContent
     */
    provider?: string;
    /**
     * 
     * @type {BaseReadConfig}
     * @memberof UpdateInstallationConfigContent
     */
    read?: BaseReadConfig;
    /**
     * 
     * @type {BaseWriteConfig}
     * @memberof UpdateInstallationConfigContent
     */
    write?: BaseWriteConfig;
}

/**
 * Check if a given object implements the UpdateInstallationConfigContent interface.
 */
export function instanceOfUpdateInstallationConfigContent(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function UpdateInstallationConfigContentFromJSON(json: any): UpdateInstallationConfigContent {
    return UpdateInstallationConfigContentFromJSONTyped(json, false);
}

export function UpdateInstallationConfigContentFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdateInstallationConfigContent {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'provider': !exists(json, 'provider') ? undefined : json['provider'],
        'read': !exists(json, 'read') ? undefined : BaseReadConfigFromJSON(json['read']),
        'write': !exists(json, 'write') ? undefined : BaseWriteConfigFromJSON(json['write']),
    };
}

export function UpdateInstallationConfigContentToJSON(value?: UpdateInstallationConfigContent | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'provider': value.provider,
        'read': BaseReadConfigToJSON(value.read),
        'write': BaseWriteConfigToJSON(value.write),
    };
}

