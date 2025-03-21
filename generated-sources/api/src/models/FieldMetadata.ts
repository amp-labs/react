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
import type { FieldValue } from './FieldValue';
import {
    FieldValueFromJSON,
    FieldValueFromJSONTyped,
    FieldValueToJSON,
} from './FieldValue';

/**
 * 
 * @export
 * @interface FieldMetadata
 */
export interface FieldMetadata {
    /**
     * The name of the field from the provider API.
     * @type {string}
     * @memberof FieldMetadata
     */
    fieldName: string;
    /**
     * The display name of the field from the provider API.
     * @type {string}
     * @memberof FieldMetadata
     */
    displayName: string;
    /**
     * A normalized field type
     * @type {string}
     * @memberof FieldMetadata
     */
    valueType?: FieldMetadataValueTypeEnum;
    /**
     * Raw field type from the provider API.
     * @type {string}
     * @memberof FieldMetadata
     */
    providerType?: string;
    /**
     * Whether the field is read-only.
     * @type {boolean}
     * @memberof FieldMetadata
     */
    readOnly?: boolean;
    /**
     * If the valueType is singleSelect or multiSelect, this is a list of possible values
     * @type {Array<FieldValue>}
     * @memberof FieldMetadata
     */
    values?: Array<FieldValue>;
}


/**
 * @export
 */
export const FieldMetadataValueTypeEnum = {
    String: 'string',
    Boolean: 'boolean',
    SingleSelect: 'singleSelect',
    MultiSelect: 'multiSelect',
    Date: 'date',
    Datetime: 'datetime',
    Int: 'int',
    Float: 'float',
    Other: 'other'
} as const;
export type FieldMetadataValueTypeEnum = typeof FieldMetadataValueTypeEnum[keyof typeof FieldMetadataValueTypeEnum];


/**
 * Check if a given object implements the FieldMetadata interface.
 */
export function instanceOfFieldMetadata(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "fieldName" in value;
    isInstance = isInstance && "displayName" in value;

    return isInstance;
}

export function FieldMetadataFromJSON(json: any): FieldMetadata {
    return FieldMetadataFromJSONTyped(json, false);
}

export function FieldMetadataFromJSONTyped(json: any, ignoreDiscriminator: boolean): FieldMetadata {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'fieldName': json['fieldName'],
        'displayName': json['displayName'],
        'valueType': !exists(json, 'valueType') ? undefined : json['valueType'],
        'providerType': !exists(json, 'providerType') ? undefined : json['providerType'],
        'readOnly': !exists(json, 'readOnly') ? undefined : json['readOnly'],
        'values': !exists(json, 'values') ? undefined : ((json['values'] as Array<any>).map(FieldValueFromJSON)),
    };
}

export function FieldMetadataToJSON(value?: FieldMetadata | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'fieldName': value.fieldName,
        'displayName': value.displayName,
        'valueType': value.valueType,
        'providerType': value.providerType,
        'readOnly': value.readOnly,
        'values': value.values === undefined ? undefined : ((value.values as Array<any>).map(FieldValueToJSON)),
    };
}

