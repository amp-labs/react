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
import type { BackfillConfig } from './BackfillConfig';
import {
    BackfillConfigFromJSON,
    BackfillConfigFromJSONTyped,
    BackfillConfigToJSON,
} from './BackfillConfig';

/**
 * 
 * @export
 * @interface BaseReadConfigObject
 */
export interface BaseReadConfigObject {
    /**
     * The name of the object to read from.
     * @type {string}
     * @memberof BaseReadConfigObject
     */
    objectName?: string;
    /**
     * The schedule for reading the object, in cron syntax.
     * @type {string}
     * @memberof BaseReadConfigObject
     */
    schedule?: string;
    /**
     * The name of the destination that the result should be sent to.
     * @type {string}
     * @memberof BaseReadConfigObject
     */
    destination?: string;
    /**
     * This is a map of field names to booleans indicating whether they should be read.
     * @type {{ [key: string]: boolean; }}
     * @memberof BaseReadConfigObject
     */
    selectedFields?: { [key: string]: boolean; };
    /**
     * This is a map of mapToNames to field names. (A mapTo name is the name the builder wants to map a field to when it lands in their destination.)
     * @type {{ [key: string]: string; }}
     * @memberof BaseReadConfigObject
     */
    selectedFieldMappings?: { [key: string]: string; };
    /**
     * 
     * @type {BackfillConfig}
     * @memberof BaseReadConfigObject
     */
    backfill?: BackfillConfig;
}

/**
 * Check if a given object implements the BaseReadConfigObject interface.
 */
export function instanceOfBaseReadConfigObject(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function BaseReadConfigObjectFromJSON(json: any): BaseReadConfigObject {
    return BaseReadConfigObjectFromJSONTyped(json, false);
}

export function BaseReadConfigObjectFromJSONTyped(json: any, ignoreDiscriminator: boolean): BaseReadConfigObject {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'objectName': !exists(json, 'objectName') ? undefined : json['objectName'],
        'schedule': !exists(json, 'schedule') ? undefined : json['schedule'],
        'destination': !exists(json, 'destination') ? undefined : json['destination'],
        'selectedFields': !exists(json, 'selectedFields') ? undefined : json['selectedFields'],
        'selectedFieldMappings': !exists(json, 'selectedFieldMappings') ? undefined : json['selectedFieldMappings'],
        'backfill': !exists(json, 'backfill') ? undefined : BackfillConfigFromJSON(json['backfill']),
    };
}

export function BaseReadConfigObjectToJSON(value?: BaseReadConfigObject | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'objectName': value.objectName,
        'schedule': value.schedule,
        'destination': value.destination,
        'selectedFields': value.selectedFields,
        'selectedFieldMappings': value.selectedFieldMappings,
        'backfill': BackfillConfigToJSON(value.backfill),
    };
}

