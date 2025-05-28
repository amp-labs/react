import { useCallback, useEffect, useState } from "react";
import type {
  BaseReadConfigObject,
  BaseWriteConfigObject,
  FieldSetting,
  FieldSettingDefault,
  FieldSettingWriteOnCreateEnum,
  FieldSettingWriteOnUpdateEnum,
} from "@generated/api/src";
import { produce } from "immer";

import { useInstallation } from "../installation/useInstallation";
import { useManifest } from "../manifest/useManifest";

import type { InstallationConfigContent } from "./types";

type ReadObjectHandlers = {
  object: BaseReadConfigObject | undefined;
  getSelectedField: (fieldName: string) => boolean;
  setSelectedField: (params: { fieldName: string; selected: boolean }) => void;
  getFieldMapping: (fieldName: string) => string | undefined;
  setFieldMapping: (params: { fieldName: string; mapToName: string }) => void;
};

type WriteObjectHandlers = {
  object: BaseWriteConfigObject | undefined;
  setEnableWrite: () => void;
  setDisableWrite: () => void;
  getWriteObject: () => BaseWriteConfigObject | undefined;
  // advanced write features
  // https://docs.withampersand.com/write-actions#advanced-use-cases
  getSelectedFieldSettings: (fieldName: string) => FieldSetting | undefined;
  setSelectedFieldSettings: (params: {
    fieldName: string;
    settings: FieldSetting;
  }) => void;
  getDefaultValues: (fieldName: string) => FieldSettingDefault | undefined;
  setDefaultValues: (params: {
    fieldName: string;
    value: FieldSettingDefault;
  }) => void;
  getWriteOnCreateSetting: (
    fieldName: string,
  ) => FieldSettingWriteOnCreateEnum | undefined;
  setWriteOnCreateSetting: (params: {
    fieldName: string;
    value: FieldSettingWriteOnCreateEnum;
  }) => void;
  getWriteOnUpdateSetting: (
    fieldName: string,
  ) => FieldSettingWriteOnUpdateEnum | undefined;
  setWriteOnUpdateSetting: (params: {
    fieldName: string;
    value: FieldSettingWriteOnUpdateEnum;
  }) => void;
};

export function useConfigHelper(initialConfig: InstallationConfigContent) {
  const [draft, setDraft] = useState<InstallationConfigContent>(initialConfig);

  const { getReadObject: getReadObjectFromManifest, data: manifest } =
    useManifest();
  const { installation } = useInstallation();

  const get = useCallback(() => draft, [draft]);

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
    (objectName: string, _draft: InstallationConfigContent) => {
      // initialize provider if not set
      _draft.provider = _draft.provider || manifest?.content?.provider || "";
      const read = _draft.read || { objects: {} };
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
      obj.schedule = obj.schedule || defaultSchedule || "";
      obj.destination = obj.destination || defaultDestination || "";
      obj.selectedFields = obj.selectedFields || defaultSelectedFields;

      objects[objectName] = obj;
      read.objects = objects;
      _draft.read = read;

      return { read, objects, obj };
    },
    [getReadObjectFromManifest, manifest?.content?.provider],
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

  const writeObject = useCallback(
    (objectName: string): WriteObjectHandlers => {
      const object = draft.write?.objects?.[objectName];

      const initializeWriteObject = (_draft: InstallationConfigContent) => {
        // initialize write if it doesn't exist
        const write = _draft.write || {};
        // initialize object if it doesn't exist
        const objects = write.objects || {};
        const obj = objects[objectName] || {
          objectName: objectName, // required field
        };

        objects[objectName] = obj;
        write.objects = objects;
        _draft.write = write;

        return { write, objects, obj };
      };

      // Helper function to get field setting value
      const getFieldSetting = <T extends keyof FieldSetting>(
        fieldName: string,
        settingKey: T,
      ): FieldSetting[T] | undefined => {
        return object?.selectedFieldSettings?.[fieldName]?.[settingKey];
      };

      // Helper function to set field setting value
      const setFieldSetting = <T extends keyof FieldSetting>(
        fieldName: string,
        settingKey: T,
        value: FieldSetting[T],
      ) => {
        setDraft((prev) =>
          produce(prev, (_draft) => {
            const { obj } = initializeWriteObject(_draft);

            obj.selectedFieldSettings = {
              ...obj.selectedFieldSettings,
              [fieldName]: {
                ...obj.selectedFieldSettings?.[fieldName],
                [settingKey]: value,
              },
            };
          }),
        );
      };

      return {
        object: object,
        setEnableWrite: () => {
          setDraft((prev) =>
            produce(prev, (_draft) => {
              const { obj } = initializeWriteObject(_draft);
              obj.objectName = objectName;
            }),
          );
        },
        setDisableWrite: () => {
          setDraft((prev) =>
            produce(prev, (_draft) => {
              const { objects } = initializeWriteObject(_draft);
              delete objects[objectName];
            }),
          );
        },
        getWriteObject: () => {
          return draft.write?.objects?.[objectName];
        },
        getSelectedFieldSettings: (fieldName: string) =>
          object?.selectedFieldSettings?.[fieldName],
        setSelectedFieldSettings: ({ fieldName, settings }) => {
          setDraft((prev) =>
            produce(prev, (_draft) => {
              const { obj } = initializeWriteObject(_draft);

              // initialize selectedFieldSettings if it doesn't exist
              const selectedFieldSettings = obj.selectedFieldSettings || {};

              obj.selectedFieldSettings = {
                ...selectedFieldSettings,
                [fieldName]: settings,
              };

              // if settings is undefined, remove the field from selectedFieldSettings
              if (settings === undefined) {
                delete obj.selectedFieldSettings[fieldName];
              }
            }),
          );
        },
        getDefaultValues: (fieldName: string) =>
          getFieldSetting(fieldName, "_default"),
        setDefaultValues: ({ fieldName, value }) =>
          setFieldSetting(fieldName, "_default", value),
        getWriteOnCreateSetting: (fieldName: string) =>
          getFieldSetting(fieldName, "writeOnCreate"),
        setWriteOnCreateSetting: ({ fieldName, value }) =>
          setFieldSetting(fieldName, "writeOnCreate", value),
        getWriteOnUpdateSetting: (fieldName: string) =>
          getFieldSetting(fieldName, "writeOnUpdate"),
        setWriteOnUpdateSetting: ({ fieldName, value }) =>
          setFieldSetting(fieldName, "writeOnUpdate", value),
      };
    },
    [draft.write?.objects],
  );

  const reset = useCallback(() => {
    // set the draft config to the installation config
    setDraft((prev) =>
      produce(prev, (draft) => {
        Object.assign(draft, installation?.config?.content);
      }),
    );
  }, [installation?.config?.content]);

  useEffect(() => {
    console.debug("Installation found", { installation });
    // sync the installation config to the local config
    reset();
  }, [installation, reset]);

  return {
    draft,
    get,
    reset,
    setDraft,
    readObject,
    writeObject,
  };
}
