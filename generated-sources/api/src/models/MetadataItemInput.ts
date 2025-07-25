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
 * @interface MetadataItemInput
 */
export interface MetadataItemInput {
    /**
     * The internal identifier for the metadata field
     * @type {string}
     * @memberof MetadataItemInput
     */
    name: string;
    /**
     * The human-readable name for the field
     * @type {string}
     * @memberof MetadataItemInput
     */
    displayName?: string;
    /**
     * Default value for this metadata item
     * @type {string}
     * @memberof MetadataItemInput
     */
    defaultValue?: string;
    /**
     * URL with more information about how to locate this value
     * @type {string}
     * @memberof MetadataItemInput
     */
    docsURL?: string;
    /**
     * Does this metadata item only apply to a specific module?
     * @type {{ [key: string]: object; }}
     * @memberof MetadataItemInput
     */
    moduleDependencies?: { [key: string]: object; };
}

/**
 * Check if a given object implements the MetadataItemInput interface.
 */
export function instanceOfMetadataItemInput(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;

    return isInstance;
}

export function MetadataItemInputFromJSON(json: any): MetadataItemInput {
    return MetadataItemInputFromJSONTyped(json, false);
}

export function MetadataItemInputFromJSONTyped(json: any, ignoreDiscriminator: boolean): MetadataItemInput {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': json['name'],
        'displayName': !exists(json, 'displayName') ? undefined : json['displayName'],
        'defaultValue': !exists(json, 'defaultValue') ? undefined : json['defaultValue'],
        'docsURL': !exists(json, 'docsURL') ? undefined : json['docsURL'],
        'moduleDependencies': !exists(json, 'moduleDependencies') ? undefined : json['moduleDependencies'],
    };
}

export function MetadataItemInputToJSON(value?: MetadataItemInput | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'displayName': value.displayName,
        'defaultValue': value.defaultValue,
        'docsURL': value.docsURL,
        'moduleDependencies': value.moduleDependencies,
    };
}

