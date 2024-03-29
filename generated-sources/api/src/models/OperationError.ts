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
 * @interface OperationError
 */
export interface OperationError {
    /**
     * The attempt number.
     * @type {number}
     * @memberof OperationError
     */
    attempt?: number;
    /**
     * The time the error occurred.
     * @type {Date}
     * @memberof OperationError
     */
    timestamp?: Date;
    /**
     * The status of the operation.
     * @type {string}
     * @memberof OperationError
     */
    status?: string;
    /**
     * The error message.
     * @type {string}
     * @memberof OperationError
     */
    error?: string;
}

/**
 * Check if a given object implements the OperationError interface.
 */
export function instanceOfOperationError(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function OperationErrorFromJSON(json: any): OperationError {
    return OperationErrorFromJSONTyped(json, false);
}

export function OperationErrorFromJSONTyped(json: any, ignoreDiscriminator: boolean): OperationError {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'attempt': !exists(json, 'attempt') ? undefined : json['attempt'],
        'timestamp': !exists(json, 'timestamp') ? undefined : (new Date(json['timestamp'])),
        'status': !exists(json, 'status') ? undefined : json['status'],
        'error': !exists(json, 'error') ? undefined : json['error'],
    };
}

export function OperationErrorToJSON(value?: OperationError | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'attempt': value.attempt,
        'timestamp': value.timestamp === undefined ? undefined : (value.timestamp.toISOString()),
        'status': value.status,
        'error': value.error,
    };
}

