/**
 * Based on sample
 *
  const manifest = useManifest();

  // Get the required and optional fields defined in amp.yaml (allows ide flexibility)
  const requiredFields = manifest.getReadObject(SELECTED_OBJECT_NAME).getRequiredFields();
  const optionalFields = manifest.getReadObject(SELECTED_OBJECT_NAME).getOptionalFields();

  // Get all the fields that exist in the customer's Hubspot Contact object
  const allFields = manifest.getCustomerFieldsForObject(SELECTED_OBJECT_NAME)
 */

import { useMemo } from "react";
import {
  FieldMetadata,
  HydratedIntegrationField,
  HydratedIntegrationObject,
} from "@generated/api/src";

import { useHydratedRevisionQuery } from "./useHydratedRevisionQuery";

export interface Manifest {
  getReadObject: (objectName: string) => {
    object: HydratedIntegrationObject | null;
    getRequiredFields: () => HydratedIntegrationField[] | null;
    getOptionalFields: () => HydratedIntegrationField[] | null;
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
          };
        }

        return {
          object,
          getRequiredFields: (): HydratedIntegrationField[] =>
            object.requiredFields ?? [],
          getOptionalFields: (): HydratedIntegrationField[] =>
            object.optionalFields ?? [],
        };
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
    [content?.read?.objects],
  );

  return {
    data: hydatedRevision,
    ...manifest,
    isPending,
    isFetching,
    isError,
    isSuccess,
    error,
  };
}
