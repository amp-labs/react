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
import type { FieldSettingDefaultIntegerDefault } from './FieldSettingDefaultIntegerDefault';
import {
    FieldSettingDefaultIntegerDefaultFromJSON,
    FieldSettingDefaultIntegerDefaultFromJSONTyped,
    FieldSettingDefaultIntegerDefaultToJSON,
} from './FieldSettingDefaultIntegerDefault';

/**
 * 
 * @export
 * @interface FieldSettingDefaultInteger
 */
export interface FieldSettingDefaultInteger {
    /**
     * 
     * @type {FieldSettingDefaultIntegerDefault}
     * @memberof FieldSettingDefaultInteger
     */
    _default: FieldSettingDefaultIntegerDefault;
    /**
     * Whether the default value should be applied when creating a record.
     * @type {string}
     * @memberof FieldSettingDefaultInteger
     */
    writeOnCreate: FieldSettingDefaultIntegerWriteOnCreateEnum;
    /**
     * Whether the default value should be applied when updating a record.
     * @type {string}
     * @memberof FieldSettingDefaultInteger
     */
    writeOnUpdate: FieldSettingDefaultIntegerWriteOnUpdateEnum;
}


/**
 * @export
 */
export const FieldSettingDefaultIntegerWriteOnCreateEnum = {
    Always: 'always',
    Never: 'never'
} as const;
export type FieldSettingDefaultIntegerWriteOnCreateEnum = typeof FieldSettingDefaultIntegerWriteOnCreateEnum[keyof typeof FieldSettingDefaultIntegerWriteOnCreateEnum];

/**
 * @export
 */
export const FieldSettingDefaultIntegerWriteOnUpdateEnum = {
    Always: 'always',
    Never: 'never'
} as const;
export type FieldSettingDefaultIntegerWriteOnUpdateEnum = typeof FieldSettingDefaultIntegerWriteOnUpdateEnum[keyof typeof FieldSettingDefaultIntegerWriteOnUpdateEnum];


/**
 * Check if a given object implements the FieldSettingDefaultInteger interface.
 */
export function instanceOfFieldSettingDefaultInteger(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "_default" in value;
    isInstance = isInstance && "writeOnCreate" in value;
    isInstance = isInstance && "writeOnUpdate" in value;

    return isInstance;
}

export function FieldSettingDefaultIntegerFromJSON(json: any): FieldSettingDefaultInteger {
    return FieldSettingDefaultIntegerFromJSONTyped(json, false);
}

export function FieldSettingDefaultIntegerFromJSONTyped(json: any, ignoreDiscriminator: boolean): FieldSettingDefaultInteger {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        '_default': FieldSettingDefaultIntegerDefaultFromJSON(json['default']),
        'writeOnCreate': json['writeOnCreate'],
        'writeOnUpdate': json['writeOnUpdate'],
    };
}

export function FieldSettingDefaultIntegerToJSON(value?: FieldSettingDefaultInteger | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'default': FieldSettingDefaultIntegerDefaultToJSON(value._default),
        'writeOnCreate': value.writeOnCreate,
        'writeOnUpdate': value.writeOnUpdate,
    };
}

