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
 * @interface CreateBillingAccountSession200Response
 */
export interface CreateBillingAccountSession200Response {
    /**
     * The URL to redirect to in order to start the portal session.
     * @type {string}
     * @memberof CreateBillingAccountSession200Response
     */
    url: string;
}

/**
 * Check if a given object implements the CreateBillingAccountSession200Response interface.
 */
export function instanceOfCreateBillingAccountSession200Response(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "url" in value;

    return isInstance;
}

export function CreateBillingAccountSession200ResponseFromJSON(json: any): CreateBillingAccountSession200Response {
    return CreateBillingAccountSession200ResponseFromJSONTyped(json, false);
}

export function CreateBillingAccountSession200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateBillingAccountSession200Response {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'url': json['url'],
    };
}

export function CreateBillingAccountSession200ResponseToJSON(value?: CreateBillingAccountSession200Response | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'url': value.url,
    };
}
