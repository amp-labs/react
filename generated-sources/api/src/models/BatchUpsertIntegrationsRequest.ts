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
 * The source of the integrations to upsert. One of sourceZipUrl or sourceYaml is required.
 * @export
 * @interface BatchUpsertIntegrationsRequest
 */
export interface BatchUpsertIntegrationsRequest {
    /**
     * URL of where a zip of the source files can be downloaded (e.g. Google Cloud Storage URL).
     * @type {string}
     * @memberof BatchUpsertIntegrationsRequest
     */
    sourceZipUrl?: string;
    /**
     * A YAML string that defines the integrations.
     * @type {string}
     * @memberof BatchUpsertIntegrationsRequest
     */
    sourceYaml?: string;
}

/**
 * Check if a given object implements the BatchUpsertIntegrationsRequest interface.
 */
export function instanceOfBatchUpsertIntegrationsRequest(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function BatchUpsertIntegrationsRequestFromJSON(json: any): BatchUpsertIntegrationsRequest {
    return BatchUpsertIntegrationsRequestFromJSONTyped(json, false);
}

export function BatchUpsertIntegrationsRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): BatchUpsertIntegrationsRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'sourceZipUrl': !exists(json, 'sourceZipUrl') ? undefined : json['sourceZipUrl'],
        'sourceYaml': !exists(json, 'sourceYaml') ? undefined : json['sourceYaml'],
    };
}

export function BatchUpsertIntegrationsRequestToJSON(value?: BatchUpsertIntegrationsRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'sourceZipUrl': value.sourceZipUrl,
        'sourceYaml': value.sourceYaml,
    };
}

