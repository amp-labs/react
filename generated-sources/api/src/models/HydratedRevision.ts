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
import type { HydratedIntegration } from './HydratedIntegration';
import {
    HydratedIntegrationFromJSON,
    HydratedIntegrationFromJSONTyped,
    HydratedIntegrationToJSON,
} from './HydratedIntegration';

/**
 * 
 * @export
 * @interface HydratedRevision
 */
export interface HydratedRevision {
    /**
     * The revision ID.
     * @type {string}
     * @memberof HydratedRevision
     */
    id: string;
    /**
     * The spec version string (e.g. "0.1.0").
     * @type {string}
     * @memberof HydratedRevision
     */
    specVersion: string;
    /**
     * The time the revision was created.
     * @type {Date}
     * @memberof HydratedRevision
     */
    createTime: Date;
    /**
     * 
     * @type {HydratedIntegration}
     * @memberof HydratedRevision
     */
    content: HydratedIntegration;
}

/**
 * Check if a given object implements the HydratedRevision interface.
 */
export function instanceOfHydratedRevision(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "specVersion" in value;
    isInstance = isInstance && "createTime" in value;
    isInstance = isInstance && "content" in value;

    return isInstance;
}

export function HydratedRevisionFromJSON(json: any): HydratedRevision {
    return HydratedRevisionFromJSONTyped(json, false);
}

export function HydratedRevisionFromJSONTyped(json: any, ignoreDiscriminator: boolean): HydratedRevision {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'specVersion': json['specVersion'],
        'createTime': (new Date(json['createTime'])),
        'content': HydratedIntegrationFromJSON(json['content']),
    };
}

export function HydratedRevisionToJSON(value?: HydratedRevision | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'specVersion': value.specVersion,
        'createTime': (value.createTime.toISOString()),
        'content': HydratedIntegrationToJSON(value.content),
    };
}
