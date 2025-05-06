import { useCallback, useState } from "react";
import type {
  BaseReadConfigObject,
  UpdateInstallationConfigContent,
} from "@generated/api/src";
import { produce } from "immer";

import { useManifest } from "../manifest/useManifest";
type ReadObjectHandlers = {
  object: BaseReadConfigObject | undefined;
  getSelectedField: (fieldName: string) => boolean;
  setSelectedField: (params: { fieldName: string; selected: boolean }) => void;
  getFieldMapping: (fieldName: string) => string | undefined;
  setFieldMapping: (params: { fieldName: string; mapToName: string }) => void;
};

export function useConfigHelper(
  initialConfig: UpdateInstallationConfigContent,
) {
  const [draft, setDraft] =
    useState<UpdateInstallationConfigContent>(initialConfig);
  const [initial] = useState(initialConfig); // For reset

  const { getReadObject: getReadObjectFromManifest } = useManifest();

  const get = useCallback(() => draft, [draft]);

  const reset = useCallback(() => {
    setDraft(initial);
  }, [initial]);

  /**
   * Initializes an object within the `_draft` configuration with default values from the manifest.
   *
   * @param objectName - The name of the object to initialize.
   * @param _draft - The draft configuration object to modify. This object is updated in place.
   *
   * Side Effects:
   * - Modifies the `_draft.read.objects` property by adding or updating the specified object.
   * - Sets default values for `schedule`, `destination`, and `selectedFields` based on the manifest.
   * - Ensures required fields are initialized if not already set.
   */
  const initializeObjectWithDefaults = useCallback(
    (objectName: string, _draft: UpdateInstallationConfigContent) => {
      const read = _draft.read || {};
      const objects = read.objects || {};
      const obj = objects[objectName] || {};

      // note: prefilling default values from manifest can be removed once taken care of in the backend
      const selectedObject = getReadObjectFromManifest(objectName);
      const defaultSchedule = selectedObject?.object?.schedule;
      const defaultDestination = selectedObject?.object?.destination;

      // Add required fields to defaultSelectedFields
      const defaultSelectedFields: { [key: string]: boolean } = {};
      selectedObject?.getRequiredFields()?.forEach((field) => {
        if ("fieldName" in field) {
          defaultSelectedFields[field.fieldName] = true;
        }
      });

      // Initialize required fields for object from manifest if not set
      obj.objectName = obj.objectName || objectName;
      obj.schedule = obj.schedule || defaultSchedule;
      obj.destination = obj.destination || defaultDestination;
      obj.selectedFields = obj.selectedFields || defaultSelectedFields;

      objects[objectName] = obj;
      read.objects = objects;
      _draft.read = read;

      return { read, objects, obj };
    },
    [getReadObjectFromManifest],
  );

  const readObject = useCallback(
    (objectName: string): ReadObjectHandlers => ({
      object: draft.read?.objects?.[objectName],
      getSelectedField: (fieldName: string) =>
        !!draft.read?.objects?.[objectName]?.selectedFields?.[fieldName],

      setSelectedField: ({ fieldName, selected }) => {
        setDraft((prev) =>
          produce(prev, (_draft) => {
            const { obj } = initializeObjectWithDefaults(objectName, _draft);

            // Initialize selectedFields if it doesn't exist
            obj.selectedFields = obj.selectedFields || {};
            obj.selectedFields[fieldName] = selected;

            // If selected is false, remove the field from selectedFields
            if (obj.selectedFields[fieldName] === false) {
              delete obj.selectedFields[fieldName];
            }
          }),
        );
      },

      getFieldMapping: (mapToName: string) =>
        draft.read?.objects?.[objectName]?.selectedFieldMappings?.[mapToName],

      setFieldMapping: ({ fieldName, mapToName }) => {
        setDraft((prev) =>
          produce(prev, (_draft) => {
            const { obj } = initializeObjectWithDefaults(objectName, _draft);

            // Initialize selectedFieldMappings if it doesn't exist
            obj.selectedFieldMappings = obj.selectedFieldMappings || {};
            obj.selectedFieldMappings[mapToName] = fieldName;
          }),
        );
      },
    }),
    [draft.read?.objects, initializeObjectWithDefaults],
  );

  return {
    draft,
    get,
    setDraft,
    reset,
    readObject,
  };
}
