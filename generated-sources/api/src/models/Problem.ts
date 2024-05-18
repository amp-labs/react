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
 * A Problem Details object (RFC 9457).
 * 
 * Additional properties specific to the problem type may be present.
 * @export
 * @interface Problem
 */
export interface Problem {
    /**
     * An absolute URI that identifies the problem type
     * @type {string}
     * @memberof Problem
     */
    type?: string;
    /**
     * An absolute URI that, when dereferenced, provides human-readable documentation for the problem type (e.g. using HTML).
     * @type {string}
     * @memberof Problem
     */
    href?: string;
    /**
     * A short summary of the problem type. Written in English and readable for engineers (usually not suited for non technical stakeholders and not localized).
     * @type {string}
     * @memberof Problem
     */
    title?: string;
    /**
     * The HTTP status code generated by the origin server for this occurrence of the problem.
     * @type {number}
     * @memberof Problem
     */
    status?: number;
    /**
     * A human-readable explanation specific to this occurrence of the problem
     * @type {string}
     * @memberof Problem
     */
    detail?: string;
    /**
     * An absolute URI that identifies the specific occurrence of the problem. It may or may not yield further information if dereferenced.
     * @type {string}
     * @memberof Problem
     */
    instance?: string;
}

/**
 * Check if a given object implements the Problem interface.
 */
export function instanceOfProblem(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ProblemFromJSON(json: any): Problem {
    return ProblemFromJSONTyped(json, false);
}

export function ProblemFromJSONTyped(json: any, ignoreDiscriminator: boolean): Problem {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'type': !exists(json, 'type') ? undefined : json['type'],
        'href': !exists(json, 'href') ? undefined : json['href'],
        'title': !exists(json, 'title') ? undefined : json['title'],
        'status': !exists(json, 'status') ? undefined : json['status'],
        'detail': !exists(json, 'detail') ? undefined : json['detail'],
        'instance': !exists(json, 'instance') ? undefined : json['instance'],
    };
}

export function ProblemToJSON(value?: Problem | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'type': value.type,
        'href': value.href,
        'title': value.title,
        'status': value.status,
        'detail': value.detail,
        'instance': value.instance,
    };
}
