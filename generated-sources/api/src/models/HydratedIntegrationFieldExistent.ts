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
/**
 * 
 * @export
 * @interface HydratedIntegrationFieldExistent
 */
export interface HydratedIntegrationFieldExistent {
    /**
     * 
     * @type {string}
     * @memberof HydratedIntegrationFieldExistent
     */
    fieldName: string;
    /**
     * 
     * @type {string}
     * @memberof HydratedIntegrationFieldExistent
     */
    displayName: string;
}

/**
 * Check if a given object implements the HydratedIntegrationFieldExistent interface.
 */
export function instanceOfHydratedIntegrationFieldExistent(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "fieldName" in value;
    isInstance = isInstance && "displayName" in value;

    return isInstance;
}

export function HydratedIntegrationFieldExistentFromJSON(json: any): HydratedIntegrationFieldExistent {
    return HydratedIntegrationFieldExistentFromJSONTyped(json, false);
}

export function HydratedIntegrationFieldExistentFromJSONTyped(json: any, ignoreDiscriminator: boolean): HydratedIntegrationFieldExistent {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'fieldName': json['fieldName'],
        'displayName': json['displayName'],
    };
}

export function HydratedIntegrationFieldExistentToJSON(value?: HydratedIntegrationFieldExistent | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'fieldName': value.fieldName,
        'displayName': value.displayName,
    };
}
