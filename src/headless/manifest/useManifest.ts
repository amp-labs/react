/**
 * Based on sample
 *
  const manifest = useManifest();
  const read = manifest.getReadObject(SELECTED_OBJECT_NAME);

  // Include param: "raw" (default, existent + mappings), "no-mappings", or "mappings"
  const requiredFields = read.getRequiredFields();           // raw
  const requiredNoMappings = read.getRequiredFields("no-mappings");
  const requiredMappings = read.getRequiredFields("mappings"); // or read.getRequiredMapFields()
  const optionalFields = read.getOptionalFields("no-mappings");

  // Get all the fields that exist in the customer's Hubspot Contact object
  const allFields = manifest.getCustomerFieldsForObject(SELECTED_OBJECT_NAME)
 */

import { useMemo } from "react";
import {
  FieldMetadata,
  HydratedIntegrationField,
  HydratedIntegrationObject,
  HydratedIntegrationWriteObject,
  IntegrationFieldMapping,
} from "@generated/api/src";
import {
  getOptionalFieldsFromObject,
  getOptionalMapFieldsFromObject,
  getRequiredFieldsFromObject,
  getRequiredMapFieldsFromObject,
} from "src/utils/manifest";

import { useHydratedRevisionQuery } from "./useHydratedRevisionQuery";

/** Filter for getRequiredFields / getOptionalFields: raw (all), no-mappings (existent only), or mappings only. */
export type FieldInclude = "raw" | "no-mappings" | "mappings";

export interface Manifest {
  getReadObject: (objectName: string) => {
    object: HydratedIntegrationObject | null;
    /**
     * Required fields. Default "raw" (existent + mappings). Use "no-mappings" or "mappings" to filter.
     */
    getRequiredFields: (
      include?: FieldInclude,
    ) => HydratedIntegrationField[] | IntegrationFieldMapping[] | null;
    /**
     * Optional fields. Default "raw" (existent + mappings). Use "no-mappings" or "mappings" to filter.
     */
    getOptionalFields: (
      include?: FieldInclude,
    ) => HydratedIntegrationField[] | IntegrationFieldMapping[] | null;
    /** Required mapping fields. Same as getRequiredFields('mappings'). */
    getRequiredMapFields: () => IntegrationFieldMapping[] | null;
    /** Optional mapping fields. Same as getOptionalFields('mappings'). */
    getOptionalMapFields: () => IntegrationFieldMapping[] | null;
  };
  getWriteObject: (objectName: string) => {
    object: HydratedIntegrationWriteObject | null;
  };
  getCustomerFieldsForObject: (objectName: string) => {
    allFields: { [key: string]: FieldMetadata } | null;
    getField: (field: string) => FieldMetadata | null;
  };
}

/**
 *  useManifest retrieves data from `amp.yaml` file, plus the customer's SaaS instance.
 * @returns Manifest object
 *
 * if object is not found, returns null for the object, getRequiredFields, getOptionalFields,
 *  getCustomerFieldsForObject.
 *
 */
export function useManifest() {
  const hydratedRevisionQuery = useHydratedRevisionQuery();
  const {
    isLoading,
    isPending,
    isFetching,
    isError,
    isSuccess,
    error,
    data: hydatedRevision,
  } = hydratedRevisionQuery;

  const content = hydatedRevision?.content;

  const manifest: Manifest = useMemo(
    () => ({
      getReadObject: (objectName: string) => {
        const object = content?.read?.objects?.find(
          (obj) => obj.objectName === objectName,
        );
        if (!object) {
          console.error(`Object ${objectName} not found`);
          return {
            object: null,
            getRequiredFields: () => null,
            getOptionalFields: () => null,
            getRequiredMapFields: () => null,
            getOptionalMapFields: () => null,
          };
        }

        const getRequiredFields = (
          include: FieldInclude = "raw",
        ): HydratedIntegrationField[] | IntegrationFieldMapping[] => {
          if (include === "mappings")
            return getRequiredMapFieldsFromObject(object) ?? [];
          if (include === "no-mappings")
            return getRequiredFieldsFromObject(object) ?? [];
          return object.requiredFields ?? [];
        };
        const getOptionalFields = (
          include: FieldInclude = "raw",
        ): HydratedIntegrationField[] | IntegrationFieldMapping[] => {
          if (include === "mappings")
            return getOptionalMapFieldsFromObject(object) ?? [];
          if (include === "no-mappings")
            return getOptionalFieldsFromObject(object) ?? [];
          return object.optionalFields ?? [];
        };

        return {
          object,
          getRequiredFields,
          getOptionalFields,
          getRequiredMapFields: (): IntegrationFieldMapping[] =>
            getRequiredFields("mappings") as IntegrationFieldMapping[],
          getOptionalMapFields: (): IntegrationFieldMapping[] =>
            getOptionalFields("mappings") as IntegrationFieldMapping[],
        };
      },
      getWriteObject: (objectName: string) => {
        const object = content?.write?.objects?.find(
          (obj) => obj.objectName === objectName,
        );
        if (!object) {
          console.error(`Object ${objectName} not found`);
          return { object: null };
        }
        return { object };
      },
      getCustomerFieldsForObject: (objectName: string) => {
        const object = content?.read?.objects?.find(
          (obj) => obj.objectName === objectName,
        );
        if (!object) {
          console.error(`Object ${objectName} not found`);
          return { allFields: null, getField: () => null };
        }
        return {
          allFields: object.allFieldsMetadata ?? {},
          getField: (field: string): FieldMetadata | null => {
            const fieldMetadata = object.allFieldsMetadata?.[field];
            if (!fieldMetadata) {
              console.error(`Field ${field} not found`);
              return null;
            }
            return fieldMetadata;
          },
        };
      },
    }),
    [content?.read?.objects, content?.write?.objects],
  );

  return {
    data: hydatedRevision,
    isLoading,
    isPending,
    isFetching,
    isError,
    isSuccess,
    error,
    ...manifest,
  };
}
