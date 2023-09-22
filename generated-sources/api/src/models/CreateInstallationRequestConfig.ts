/* tslint:disable */
/* eslint-disable */
/**
 * Ampersand API
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
import type { ConfigContent } from './ConfigContent';
import {
    ConfigContentFromJSON,
    ConfigContentFromJSONTyped,
    ConfigContentToJSON,
} from './ConfigContent';

/**
 * The config of the installation.
 * @export
 * @interface CreateInstallationRequestConfig
 */
export interface CreateInstallationRequestConfig {
    /**
     * The ID of the revision that this config is based on.
     * @type {string}
     * @memberof CreateInstallationRequestConfig
     */
    revisionId: string;
    /**
     * The person who created the config, in the format of "consumer:{consumer-id}" or "builder:{builder-id}".
     * @type {string}
     * @memberof CreateInstallationRequestConfig
     */
    createdBy: string;
    /**
     * 
     * @type {ConfigContent}
     * @memberof CreateInstallationRequestConfig
     */
    content: ConfigContent;
}

/**
 * Check if a given object implements the CreateInstallationRequestConfig interface.
 */
export function instanceOfCreateInstallationRequestConfig(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "revisionId" in value;
    isInstance = isInstance && "createdBy" in value;
    isInstance = isInstance && "content" in value;

    return isInstance;
}

export function CreateInstallationRequestConfigFromJSON(json: any): CreateInstallationRequestConfig {
    return CreateInstallationRequestConfigFromJSONTyped(json, false);
}

export function CreateInstallationRequestConfigFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateInstallationRequestConfig {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'revisionId': json['revisionId'],
        'createdBy': json['createdBy'],
        'content': ConfigContentFromJSON(json['content']),
    };
}

export function CreateInstallationRequestConfigToJSON(value?: CreateInstallationRequestConfig | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'revisionId': value.revisionId,
        'createdBy': value.createdBy,
        'content': ConfigContentToJSON(value.content),
    };
}

