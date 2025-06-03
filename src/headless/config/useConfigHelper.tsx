import { useCallback, useEffect, useState } from "react";
import type {
  BaseReadConfigObject,
  BaseWriteConfigObject,
  FieldSetting as GeneratedFieldSetting,
  FieldSettingDefault,
  FieldSettingWriteOnCreateEnum,
  FieldSettingWriteOnUpdateEnum,
} from "@generated/api/src";
import { produce } from "immer";

import { useInstallation } from "../installation/useInstallation";
import { useManifest } from "../manifest/useManifest";

import type { InstallationConfigContent } from "./types";

// Bridge type that uses 'default' instead of '_default'
// This is because the generated type uses '_default' and we want to use 'default'
// to be consistent with reference documentation for the field setting
export type FieldSetting = Omit<GeneratedFieldSetting, "_default"> & {
  default?: FieldSettingDefault;
};

// Helper function to convert between bridge type and generated type
const toGeneratedFieldSetting = (
  setting: FieldSetting,
): GeneratedFieldSetting => ({
  ...setting,
  _default: setting.default,
});

// Helper function to convert from generated type to bridge type
const fromGeneratedFieldSetting = (
  setting: GeneratedFieldSetting,
): FieldSetting => ({
  ...setting,
  default: setting._default,
});

export type ReadObjectHandlers = {
  object: BaseReadConfigObject | undefined;
  getSelectedField: (fieldName: string) => boolean;
  setSelectedField: (params: { fieldName: string; selected: boolean }) => void;
  getFieldMapping: (fieldName: string) => string | undefined;
  setFieldMapping: (params: { fieldName: string; mapToName: string }) => void;
};

export type WriteObjectHandlers = {
  object: BaseWriteConfigObject | undefined;
  setEnableWrite: () => void;
  setDisableWrite: () => void;
  getWriteObject: () => BaseWriteConfigObject | undefined;
  // advanced write features - see note above about using bridge types
  // _default is used in the generated type, but we use default in the bridge type
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
        getSelectedFieldSettings: (fieldName: string) => {
          const setting = object?.selectedFieldSettings?.[fieldName];
          return setting ? fromGeneratedFieldSetting(setting) : undefined;
        },
        setSelectedFieldSettings: ({ fieldName, settings }) => {
          setDraft((prev) =>
            produce(prev, (_draft) => {
              const { obj } = initializeWriteObject(_draft);
              obj.selectedFieldSettings = {
                ...obj.selectedFieldSettings,
                [fieldName]: toGeneratedFieldSetting(settings),
              };

              // if the settings are undefined, remove the field from selectedFieldSettings
              if (settings == undefined) {
                delete obj.selectedFieldSettings[fieldName];
              }
            }),
          );
        },
        getDefaultValues: (fieldName: string) => {
          const setting = object?.selectedFieldSettings?.[fieldName];
          if (!setting) return undefined;
          const bridgeSetting = fromGeneratedFieldSetting(setting);
          return bridgeSetting.default;
        },
        setDefaultValues: ({ fieldName, value }) => {
          setDraft((prev) =>
            produce(prev, (_draft) => {
              const { obj } = initializeWriteObject(_draft);
              const currentSetting = obj.selectedFieldSettings?.[fieldName];
              const bridgeSetting = currentSetting
                ? fromGeneratedFieldSetting(currentSetting)
                : {};

              obj.selectedFieldSettings = {
                ...obj.selectedFieldSettings,
                [fieldName]: toGeneratedFieldSetting({
                  ...bridgeSetting,
                  default: value,
                }),
              };
            }),
          );
        },
        getWriteOnCreateSetting: (fieldName: string) => {
          const setting = object?.selectedFieldSettings?.[fieldName];
          if (!setting) return undefined;
          const bridgeSetting = fromGeneratedFieldSetting(setting);
          return bridgeSetting.writeOnCreate;
        },
        setWriteOnCreateSetting: ({ fieldName, value }) => {
          setDraft((prev) =>
            produce(prev, (_draft) => {
              const { obj } = initializeWriteObject(_draft);
              const currentSetting = obj.selectedFieldSettings?.[fieldName];
              const bridgeSetting = currentSetting
                ? fromGeneratedFieldSetting(currentSetting)
                : {};

              obj.selectedFieldSettings = {
                ...obj.selectedFieldSettings,
                [fieldName]: toGeneratedFieldSetting({
                  ...bridgeSetting,
                  writeOnCreate: value,
                }),
              };
            }),
          );
        },
        getWriteOnUpdateSetting: (fieldName: string) => {
          const setting = object?.selectedFieldSettings?.[fieldName];
          if (!setting) return undefined;
          const bridgeSetting = fromGeneratedFieldSetting(setting);
          return bridgeSetting.writeOnUpdate;
        },
        setWriteOnUpdateSetting: ({ fieldName, value }) => {
          setDraft((prev) =>
            produce(prev, (_draft) => {
              const { obj } = initializeWriteObject(_draft);
              const currentSetting = obj.selectedFieldSettings?.[fieldName];
              const bridgeSetting = currentSetting
                ? fromGeneratedFieldSetting(currentSetting)
                : {};

              obj.selectedFieldSettings = {
                ...obj.selectedFieldSettings,
                [fieldName]: toGeneratedFieldSetting({
                  ...bridgeSetting,
                  writeOnUpdate: value,
                }),
              };
            }),
          );
        },
      };
    },
    [draft],
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
