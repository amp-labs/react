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
import type { SelectedFieldsAutoConfig } from './SelectedFieldsAutoConfig';
import {
    SelectedFieldsAutoConfigFromJSON,
    SelectedFieldsAutoConfigFromJSONTyped,
    SelectedFieldsAutoConfigToJSON,
} from './SelectedFieldsAutoConfig';

/**
 * 
 * @export
 * @interface ReadConfigObject
 */
export interface ReadConfigObject {
    /**
     * The name of the object to read from.
     * @type {string}
     * @memberof ReadConfigObject
     */
    objectName: string;
    /**
     * The schedule for reading the object, in cron syntax.
     * @type {string}
     * @memberof ReadConfigObject
     */
    schedule: string;
    /**
     * The name of the destination that the result should be sent to.
     * @type {string}
     * @memberof ReadConfigObject
     */
    destination: string;
    /**
     * This is a map of field names to booleans indicating whether they should be read. If a field is already included in `selectedFieldMappings`, it does not need to be included here.
     * @type {{ [key: string]: boolean; }}
     * @memberof ReadConfigObject
     */
    selectedFields: { [key: string]: boolean; };
    /**
     * This is a map of field names to their value mappings.
     * @type {{ [key: string]: { [key: string]: string; }; }}
     * @memberof ReadConfigObject
     */
    selectedValueMappings?: { [key: string]: { [key: string]: string; }; };
    /**
     * This is a map of mapToNames to field names. (A mapTo name is the name the builder wants to map a field to when it lands in their destination.)
     * @type {{ [key: string]: string; }}
     * @memberof ReadConfigObject
     */
    selectedFieldMappings: { [key: string]: string; };
    /**
     * 
     * @type {SelectedFieldsAutoConfig}
     * @memberof ReadConfigObject
     */
    selectedFieldsAuto?: SelectedFieldsAutoConfig;
    /**
     * 
     * @type {BackfillConfig}
     * @memberof ReadConfigObject
     */
    backfill?: BackfillConfig;
}

/**
 * Check if a given object implements the ReadConfigObject interface.
 */
export function instanceOfReadConfigObject(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "objectName" in value;
    isInstance = isInstance && "schedule" in value;
    isInstance = isInstance && "destination" in value;
    isInstance = isInstance && "selectedFields" in value;
    isInstance = isInstance && "selectedFieldMappings" in value;

    return isInstance;
}

export function ReadConfigObjectFromJSON(json: any): ReadConfigObject {
    return ReadConfigObjectFromJSONTyped(json, false);
}

export function ReadConfigObjectFromJSONTyped(json: any, ignoreDiscriminator: boolean): ReadConfigObject {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'objectName': json['objectName'],
        'schedule': json['schedule'],
        'destination': json['destination'],
        'selectedFields': json['selectedFields'],
        'selectedValueMappings': !exists(json, 'selectedValueMappings') ? undefined : json['selectedValueMappings'],
        'selectedFieldMappings': json['selectedFieldMappings'],
        'selectedFieldsAuto': !exists(json, 'selectedFieldsAuto') ? undefined : SelectedFieldsAutoConfigFromJSON(json['selectedFieldsAuto']),
        'backfill': !exists(json, 'backfill') ? undefined : BackfillConfigFromJSON(json['backfill']),
    };
}

export function ReadConfigObjectToJSON(value?: ReadConfigObject | null): any {
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
        'selectedValueMappings': value.selectedValueMappings,
        'selectedFieldMappings': value.selectedFieldMappings,
        'selectedFieldsAuto': SelectedFieldsAutoConfigToJSON(value.selectedFieldsAuto),
        'backfill': BackfillConfigToJSON(value.backfill),
    };
}

