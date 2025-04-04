/**
 * Based on sample
 *
  const manifest = useManifest();

  // Get the required and optional fields defined in amp.yaml (allows ide flexibility)
  const requiredFields = manifest.readObject(SELECTED_OBJECT_NAME).getRequiredFields();
  const optionalFields = manifest.readObject(SELECTED_OBJECT_NAME).getOptionalFields();

  // Get all the fields that exist in the customer's Hubspot Contact object
  const allFields = manifest.getCustomerFieldsForObject(SELECTED_OBJECT_NAME)
 */

import { useMemo } from 'react';
import { FieldMetadata, HydratedIntegrationField, HydratedIntegrationObject } from '@generated/api/src';

import { useHydratedRevisionQuery } from './useHydratedRevisionQuery';

export interface Manifest {
  readObject: (objectName: string) => {
    object: HydratedIntegrationObject,
    getRequiredFields: () => HydratedIntegrationField[];
    getOptionalFields: () => HydratedIntegrationField[];
  };
  getCustomerFieldsForObject: (objectName: string) => HydratedIntegrationField[];
  getCustomerFieldsMetadataForObject: (objectName: string) => {
    allFieldsMetaData:{ [key: string]: FieldMetadata; };
    getField: (field: string) => FieldMetadata;
  }
}

/**
 *  useManifest retrieves data from `amp.yaml` file, plus the customer's SaaS instance.
 * @returns
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

  const manifest: Manifest = useMemo(() => ({
    readObject: (objectName: string) => {
      const object = content?.read?.objects?.find((obj) => obj.objectName === objectName);
      if (!object) {
        throw new Error(`Object ${objectName} not found`);
      }

      return {
        object,
        getRequiredFields: (): HydratedIntegrationField[] => object.requiredFields ?? [],
        getOptionalFields: (): HydratedIntegrationField[] => object.optionalFields ?? [],
      };
    },
    getCustomerFieldsForObject: (objectName: string): HydratedIntegrationField[] => {
      const object = content?.read?.objects?.find((obj) => obj.objectName === objectName);
      if (!object) throw new Error(`Object ${objectName} not found`);
      return object.allFields ?? [];
    },
    getCustomerFieldsMetadataForObject: (objectName: string) => {
      const object = content?.read?.objects?.find((obj) => obj.objectName === objectName);
      if (!object) throw new Error(`Object ${objectName} not found`);
      return {
        allFieldsMetaData: object.allFieldsMetadata ?? {},
        getField: (field: string): FieldMetadata => {
          const fieldMetadata = object.allFieldsMetadata?.[field];
          if (!fieldMetadata) throw new Error(`Field ${field} not found`);
          return fieldMetadata;
        },
      };
    },
  }), [content?.read?.objects]);

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
