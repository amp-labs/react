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
 * @interface UpdateOrgRequestOrg
 */
export interface UpdateOrgRequestOrg {
    /**
     * The organization label.
     * @type {string}
     * @memberof UpdateOrgRequestOrg
     */
    label?: string;
}

/**
 * Check if a given object implements the UpdateOrgRequestOrg interface.
 */
export function instanceOfUpdateOrgRequestOrg(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function UpdateOrgRequestOrgFromJSON(json: any): UpdateOrgRequestOrg {
    return UpdateOrgRequestOrgFromJSONTyped(json, false);
}

export function UpdateOrgRequestOrgFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdateOrgRequestOrg {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'label': !exists(json, 'label') ? undefined : json['label'],
    };
}

export function UpdateOrgRequestOrgToJSON(value?: UpdateOrgRequestOrg | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'label': value.label,
    };
}

