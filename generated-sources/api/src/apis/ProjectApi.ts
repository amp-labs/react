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


import * as runtime from '../runtime';
import type {
  CreateProjectRequest,
  Project,
  UpdateProjectRequest,
} from '../models';
import {
    CreateProjectRequestFromJSON,
    CreateProjectRequestToJSON,
    ProjectFromJSON,
    ProjectToJSON,
    UpdateProjectRequestFromJSON,
    UpdateProjectRequestToJSON,
} from '../models';

export interface CreateProjectOperationRequest {
    project: CreateProjectRequest;
}

export interface DeleteProjectRequest {
    projectId: string;
}

export interface GetProjectRequest {
    projectId: string;
}

export interface UpdateProjectOperationRequest {
    projectId: string;
    projectUpdate: UpdateProjectRequest;
}

/**
 * ProjectApi - interface
 * 
 * @export
 * @interface ProjectApiInterface
 */
export interface ProjectApiInterface {
    /**
     * 
     * @summary Create a new project
     * @param {CreateProjectRequest} project 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProjectApiInterface
     */
    createProjectRaw(requestParameters: CreateProjectOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Create a new project
     */
    createProject(requestParameters: CreateProjectOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * 
     * @summary Delete a project
     * @param {string} projectId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProjectApiInterface
     */
    deleteProjectRaw(requestParameters: DeleteProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Delete a project
     */
    deleteProject(requestParameters: DeleteProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * 
     * @summary Get a project
     * @param {string} projectId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProjectApiInterface
     */
    getProjectRaw(requestParameters: GetProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Project>>;

    /**
     * Get a project
     */
    getProject(requestParameters: GetProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Project>;

    /**
     * 
     * @summary Update a project
     * @param {string} projectId 
     * @param {UpdateProjectRequest} projectUpdate 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProjectApiInterface
     */
    updateProjectRaw(requestParameters: UpdateProjectOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Project>>;

    /**
     * Update a project
     */
    updateProject(requestParameters: UpdateProjectOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Project>;

}

/**
 * 
 */
export class ProjectApi extends runtime.BaseAPI implements ProjectApiInterface {

    /**
     * Create a new project
     */
    async createProjectRaw(requestParameters: CreateProjectOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.project === null || requestParameters.project === undefined) {
            throw new runtime.RequiredError('project','Required parameter requestParameters.project was null or undefined when calling createProject.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/projects`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateProjectRequestToJSON(requestParameters.project),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Create a new project
     */
    async createProject(requestParameters: CreateProjectOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.createProjectRaw(requestParameters, initOverrides);
    }

    /**
     * Delete a project
     */
    async deleteProjectRaw(requestParameters: DeleteProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling deleteProject.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/projects/{projectId}`.replace(`{${"projectId"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete a project
     */
    async deleteProject(requestParameters: DeleteProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteProjectRaw(requestParameters, initOverrides);
    }

    /**
     * Get a project
     */
    async getProjectRaw(requestParameters: GetProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Project>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling getProject.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/projects/{projectId}`.replace(`{${"projectId"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProjectFromJSON(jsonValue));
    }

    /**
     * Get a project
     */
    async getProject(requestParameters: GetProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Project> {
        const response = await this.getProjectRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Update a project
     */
    async updateProjectRaw(requestParameters: UpdateProjectOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Project>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling updateProject.');
        }

        if (requestParameters.projectUpdate === null || requestParameters.projectUpdate === undefined) {
            throw new runtime.RequiredError('projectUpdate','Required parameter requestParameters.projectUpdate was null or undefined when calling updateProject.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/projects/{projectId}`.replace(`{${"projectId"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateProjectRequestToJSON(requestParameters.projectUpdate),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProjectFromJSON(jsonValue));
    }

    /**
     * Update a project
     */
    async updateProject(requestParameters: UpdateProjectOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Project> {
        const response = await this.updateProjectRaw(requestParameters, initOverrides);
        return await response.value();
    }

}