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
import type { AssociationChangeEvent } from './AssociationChangeEvent';
import {
    AssociationChangeEventFromJSON,
    AssociationChangeEventFromJSONTyped,
    AssociationChangeEventToJSON,
} from './AssociationChangeEvent';
import type { CreateEvent } from './CreateEvent';
import {
    CreateEventFromJSON,
    CreateEventFromJSONTyped,
    CreateEventToJSON,
} from './CreateEvent';
import type { DeleteEvent } from './DeleteEvent';
import {
    DeleteEventFromJSON,
    DeleteEventFromJSONTyped,
    DeleteEventToJSON,
} from './DeleteEvent';
import type { UpdateEvent } from './UpdateEvent';
import {
    UpdateEventFromJSON,
    UpdateEventFromJSONTyped,
    UpdateEventToJSON,
} from './UpdateEvent';

/**
 * 
 * @export
 * @interface IntegrationSubscribeObject
 */
export interface IntegrationSubscribeObject {
    /**
     * 
     * @type {string}
     * @memberof IntegrationSubscribeObject
     */
    objectName: string;
    /**
     * 
     * @type {string}
     * @memberof IntegrationSubscribeObject
     */
    destination: string;
    /**
     * If true, the subscribe object will inherit the fields from the read object.
     * @type {boolean}
     * @memberof IntegrationSubscribeObject
     */
    inheritFields?: boolean;
    /**
     * 
     * @type {CreateEvent}
     * @memberof IntegrationSubscribeObject
     */
    createEvent?: CreateEvent;
    /**
     * 
     * @type {UpdateEvent}
     * @memberof IntegrationSubscribeObject
     */
    updateEvent?: UpdateEvent;
    /**
     * 
     * @type {DeleteEvent}
     * @memberof IntegrationSubscribeObject
     */
    deleteEvent?: DeleteEvent;
    /**
     * 
     * @type {AssociationChangeEvent}
     * @memberof IntegrationSubscribeObject
     */
    associationChangeEvent?: AssociationChangeEvent;
    /**
     * 
     * @type {Array<string>}
     * @memberof IntegrationSubscribeObject
     */
    otherEvents?: Array<string>;
}

/**
 * Check if a given object implements the IntegrationSubscribeObject interface.
 */
export function instanceOfIntegrationSubscribeObject(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "objectName" in value;
    isInstance = isInstance && "destination" in value;

    return isInstance;
}

export function IntegrationSubscribeObjectFromJSON(json: any): IntegrationSubscribeObject {
    return IntegrationSubscribeObjectFromJSONTyped(json, false);
}

export function IntegrationSubscribeObjectFromJSONTyped(json: any, ignoreDiscriminator: boolean): IntegrationSubscribeObject {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'objectName': json['objectName'],
        'destination': json['destination'],
        'inheritFields': !exists(json, 'inheritFields') ? undefined : json['inheritFields'],
        'createEvent': !exists(json, 'CreateEvent') ? undefined : CreateEventFromJSON(json['CreateEvent']),
        'updateEvent': !exists(json, 'UpdateEvent') ? undefined : UpdateEventFromJSON(json['UpdateEvent']),
        'deleteEvent': !exists(json, 'DeleteEvent') ? undefined : DeleteEventFromJSON(json['DeleteEvent']),
        'associationChangeEvent': !exists(json, 'AssociationChangeEvent') ? undefined : AssociationChangeEventFromJSON(json['AssociationChangeEvent']),
        'otherEvents': !exists(json, 'OtherEvents') ? undefined : json['OtherEvents'],
    };
}

export function IntegrationSubscribeObjectToJSON(value?: IntegrationSubscribeObject | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'objectName': value.objectName,
        'destination': value.destination,
        'inheritFields': value.inheritFields,
        'CreateEvent': CreateEventToJSON(value.createEvent),
        'UpdateEvent': UpdateEventToJSON(value.updateEvent),
        'DeleteEvent': DeleteEventToJSON(value.deleteEvent),
        'AssociationChangeEvent': AssociationChangeEventToJSON(value.associationChangeEvent),
        'OtherEvents': value.otherEvents,
    };
}

