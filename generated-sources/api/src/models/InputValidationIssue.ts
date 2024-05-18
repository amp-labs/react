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
 * An issue detected during input validation.
 * @export
 * @interface InputValidationIssue
 */
export interface InputValidationIssue {
    /**
     * The location of the invalid input
     * @type {string}
     * @memberof InputValidationIssue
     */
    _in?: InputValidationIssueInEnum;
    /**
     * The name of the invalid input
     * @type {string}
     * @memberof InputValidationIssue
     */
    name?: string;
    /**
     * The value of the erroneous input
     * @type {any}
     * @memberof InputValidationIssue
     */
    value?: any | null;
    /**
     * An absolute URI that identifies the problem type
     * @type {string}
     * @memberof InputValidationIssue
     */
    type?: string;
    /**
     * An absolute URI that, when dereferenced, provides human-readable documentation for the problem type (e.g. using HTML).
     * @type {string}
     * @memberof InputValidationIssue
     */
    href?: string;
    /**
     * A short summary of the problem type. Written in English and readable for engineers (usually not suited for non technical stakeholders and not localized).
     * @type {string}
     * @memberof InputValidationIssue
     */
    title?: string;
    /**
     * The HTTP status code generated by the origin server for this occurrence of the problem.
     * @type {number}
     * @memberof InputValidationIssue
     */
    status?: number;
    /**
     * A human-readable explanation specific to this occurrence of the problem
     * @type {string}
     * @memberof InputValidationIssue
     */
    detail?: string;
    /**
     * An absolute URI that identifies the specific occurrence of the problem. It may or may not yield further information if dereferenced.
     * @type {string}
     * @memberof InputValidationIssue
     */
    instance?: string;
}


/**
 * @export
 */
export const InputValidationIssueInEnum = {
    Body: 'body',
    Header: 'header',
    Path: 'path',
    Query: 'query'
} as const;
export type InputValidationIssueInEnum = typeof InputValidationIssueInEnum[keyof typeof InputValidationIssueInEnum];


/**
 * Check if a given object implements the InputValidationIssue interface.
 */
export function instanceOfInputValidationIssue(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function InputValidationIssueFromJSON(json: any): InputValidationIssue {
    return InputValidationIssueFromJSONTyped(json, false);
}

export function InputValidationIssueFromJSONTyped(json: any, ignoreDiscriminator: boolean): InputValidationIssue {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        '_in': !exists(json, 'in') ? undefined : json['in'],
        'name': !exists(json, 'name') ? undefined : json['name'],
        'value': !exists(json, 'value') ? undefined : json['value'],
        'type': !exists(json, 'type') ? undefined : json['type'],
        'href': !exists(json, 'href') ? undefined : json['href'],
        'title': !exists(json, 'title') ? undefined : json['title'],
        'status': !exists(json, 'status') ? undefined : json['status'],
        'detail': !exists(json, 'detail') ? undefined : json['detail'],
        'instance': !exists(json, 'instance') ? undefined : json['instance'],
    };
}

export function InputValidationIssueToJSON(value?: InputValidationIssue | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'in': value._in,
        'name': value.name,
        'value': value.value,
        'type': value.type,
        'href': value.href,
        'title': value.title,
        'status': value.status,
        'detail': value.detail,
        'instance': value.instance,
    };
}
