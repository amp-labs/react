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
 * The log message object.
 * @export
 * @interface LogMessage
 */
export interface LogMessage {
    /**
     * The use-readable message.
     * @type {string}
     * @memberof LogMessage
     */
    msg: string;
    /**
     * The operation event ID.
     * @type {string}
     * @memberof LogMessage
     */
    operationEventId?: string;
    /**
     * The operation ID.
     * @type {string}
     * @memberof LogMessage
     */
    operationId?: string;
}

/**
 * Check if a given object implements the LogMessage interface.
 */
export function instanceOfLogMessage(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "msg" in value;

    return isInstance;
}

export function LogMessageFromJSON(json: any): LogMessage {
    return LogMessageFromJSONTyped(json, false);
}

export function LogMessageFromJSONTyped(json: any, ignoreDiscriminator: boolean): LogMessage {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'msg': json['msg'],
        'operationEventId': !exists(json, 'operation_event_id') ? undefined : json['operation_event_id'],
        'operationId': !exists(json, 'operation_id') ? undefined : json['operation_id'],
    };
}

export function LogMessageToJSON(value?: LogMessage | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'msg': value.msg,
        'operation_event_id': value.operationEventId,
        'operation_id': value.operationId,
    };
}

