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
import type { Builder } from './Builder';
import {
    BuilderFromJSON,
    BuilderFromJSONTyped,
    BuilderToJSON,
} from './Builder';
import type { BuilderInfoOrgRole } from './BuilderInfoOrgRole';
import {
    BuilderInfoOrgRoleFromJSON,
    BuilderInfoOrgRoleFromJSONTyped,
    BuilderInfoOrgRoleToJSON,
} from './BuilderInfoOrgRole';
import type { BuilderInfoProjectRolesValue } from './BuilderInfoProjectRolesValue';
import {
    BuilderInfoProjectRolesValueFromJSON,
    BuilderInfoProjectRolesValueFromJSONTyped,
    BuilderInfoProjectRolesValueToJSON,
} from './BuilderInfoProjectRolesValue';

/**
 * 
 * @export
 * @interface BuilderInfo
 */
export interface BuilderInfo {
    /**
     * 
     * @type {Builder}
     * @memberof BuilderInfo
     */
    builder: Builder;
    /**
     * A map of project IDs to project roles for the builder.
     * @type {{ [key: string]: BuilderInfoProjectRolesValue; }}
     * @memberof BuilderInfo
     */
    projectRoles: { [key: string]: BuilderInfoProjectRolesValue; };
    /**
     * 
     * @type {BuilderInfoOrgRole}
     * @memberof BuilderInfo
     */
    orgRole?: BuilderInfoOrgRole;
}

/**
 * Check if a given object implements the BuilderInfo interface.
 */
export function instanceOfBuilderInfo(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "builder" in value;
    isInstance = isInstance && "projectRoles" in value;

    return isInstance;
}

export function BuilderInfoFromJSON(json: any): BuilderInfo {
    return BuilderInfoFromJSONTyped(json, false);
}

export function BuilderInfoFromJSONTyped(json: any, ignoreDiscriminator: boolean): BuilderInfo {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'builder': BuilderFromJSON(json['builder']),
        'projectRoles': (mapValues(json['projectRoles'], BuilderInfoProjectRolesValueFromJSON)),
        'orgRole': !exists(json, 'orgRole') ? undefined : BuilderInfoOrgRoleFromJSON(json['orgRole']),
    };
}

export function BuilderInfoToJSON(value?: BuilderInfo | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'builder': BuilderToJSON(value.builder),
        'projectRoles': (mapValues(value.projectRoles, BuilderInfoProjectRolesValueToJSON)),
        'orgRole': BuilderInfoOrgRoleToJSON(value.orgRole),
    };
}

