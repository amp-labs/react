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
import type { Integration1 } from './Integration1';
import {
    Integration1FromJSON,
    Integration1FromJSONTyped,
    Integration1ToJSON,
} from './Integration1';

/**
 * 
 * @export
 * @interface CreateIntegrationRequestLatestRevision
 */
export interface CreateIntegrationRequestLatestRevision {
    /**
     * The spec version string.
     * @type {string}
     * @memberof CreateIntegrationRequestLatestRevision
     */
    specVersion: string;
    /**
     * 
     * @type {Integration1}
     * @memberof CreateIntegrationRequestLatestRevision
     */
    content: Integration1;
}

/**
 * Check if a given object implements the CreateIntegrationRequestLatestRevision interface.
 */
export function instanceOfCreateIntegrationRequestLatestRevision(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "specVersion" in value;
    isInstance = isInstance && "content" in value;

    return isInstance;
}

export function CreateIntegrationRequestLatestRevisionFromJSON(json: any): CreateIntegrationRequestLatestRevision {
    return CreateIntegrationRequestLatestRevisionFromJSONTyped(json, false);
}

export function CreateIntegrationRequestLatestRevisionFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateIntegrationRequestLatestRevision {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'specVersion': json['specVersion'],
        'content': Integration1FromJSON(json['content']),
    };
}

export function CreateIntegrationRequestLatestRevisionToJSON(value?: CreateIntegrationRequestLatestRevision | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'specVersion': value.specVersion,
        'content': Integration1ToJSON(value.content),
    };
}

