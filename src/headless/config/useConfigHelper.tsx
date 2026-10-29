import { useCallback, useEffect, useRef, useState } from "react";
import type {
  BaseProxyConfig,
  BaseReadConfigObject,
  BaseWriteConfigObject,
  FieldSetting,
  FieldSettingDefault,
  FieldSettingWriteOnCreateEnum,
  FieldSettingWriteOnUpdateEnum,
  SubscribeConfigObject,
} from "@generated/api/src";
import type { Installation } from "@generated/api/src";
import {
  ConfigCreateEventEnabledEnum,
  ConfigDeleteEventEnabledEnum,
  ConfigUpdateEventEnabledEnum,
} from "@generated/api/src";
import { produce } from "immer";
import isEqual from "lodash.isequal";
import type { UpdateEventWatchSpec } from "src/types/subscribeEvents";
import { isReadObjectAlwaysEnabled } from "src/utils/manifest";

import { useInstallation } from "../installation/useInstallation";
import { useManifest } from "../manifest/useManifest";

import type { InstallationConfigContent } from "./types";

export type ReadObjectHandlers = {
  object: BaseReadConfigObject | undefined;
  setEnableRead: () => void;
  setDisableRead: () => void;
  getSelectedField: (fieldName: string) => boolean;
  setSelectedField: (params: { fieldName: string; selected: boolean }) => void;
  getFieldMapping: (fieldName: string) => string | undefined;
  setFieldMapping: (params: { fieldName: string; mapToName: string }) => void;
  deleteFieldMapping: (mapToName: string) => void;
};

/**
 * Handlers for one object's subscribe config. A subscribe-only object carries its own
 * events: nothing is inherited from a read object, because there is no read object.
 *
 * @experimental
 */
export type SubscribeObjectHandlers = {
  object: SubscribeConfigObject | undefined;
  /** Subscribe to create events for this object. */
  setEnableCreate: () => void;
  /** Subscribe to delete events for this object. */
  setEnableDelete: () => void;
  /**
   * Subscribe to update events. `watch` says which field changes deliver an event, as
   * either `requiredWatchFields` or `watchFieldsAuto: "all"`; the server requires one of
   * the two, so omitting it writes an update event the server will reject.
   */
  setEnableUpdate: (watch?: UpdateEventWatchSpec) => void;
  /**
   * Write the update event as `never`: no update events are delivered. `watch` still names
   * the fields the object's other events deliver, and the server requires `requiredWatchFields`
   * or `watchFieldsAuto` on a disabled config update event too.
   */
  setDisableUpdate: (watch?: UpdateEventWatchSpec) => void;
  /**
   * Whether this object takes its fields and mappings from the matching read object.
   * Written out either way, since an omitted value falls back to the manifest's
   * `inheritFieldsAndMapping`.
   */
  setInheritFieldsAndMappings: (inherit: boolean) => void;
  /**
   * Fields delivered with each event, by provider field name. A subscribe-only object
   * must select something: the server rejects a non-inheriting object that selects
   * nothing, because there is no read config behind it to inherit from.
   */
  setSelectedFields: (fields: string[]) => void;
  /** Mapped field name to provider field name. */
  setSelectedFieldMappings: (mappings: Record<string, string>) => void;
  /** Stop subscribing to this object entirely. */
  removeSubscribeObject: () => void;
};

export type WriteObjectHandlers = {
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
  setEnableDeletion: () => void;
  setDisableDeletion: () => void;
};

export type ProxyHandlers = {
  object: BaseProxyConfig | undefined;
  setEnableProxy: () => void;
  setDisableProxy: () => void;
  getProxyEnabled: () => boolean;
};

export function useConfigHelper(initialConfig: InstallationConfigContent) {
  const [draft, setDraft] = useState<InstallationConfigContent>(initialConfig);
  const previousInstallationRef = useRef<Installation | undefined>(undefined);

  const { data: manifest, getReadObject, getReadObjects } = useManifest();
  const { installation } = useInstallation();

  // Objects marked `enabled: always` are read for every installation, and the server rejects a
  // config that disables or drops them, so the helpers below leave them in place.
  const isAlwaysEnabled = useCallback(
    (objectName: string) =>
      isReadObjectAlwaysEnabled(
        getReadObjects().find((obj) => obj.objectName === objectName),
      ),
    [getReadObjects],
  );

  const get = useCallback(() => draft, [draft]);

  /**
   * Initializes an object within the `_draft` configuration with default values from the manifest.
   *
   * @param objectName - The name of the object to initialize.
   * @param _draft - The draft configuration object to modify. This object is updated in place.
   *
   * Side Effects:
   * - Modifies the `_draft.read.objects` property by adding or updating the specified object.
   * - Sets default values for `selectedFields` based on the manifest.
   * - Ensures required fields are initialized if not already set.
   */
  const initializeObjectWithDefaults = useCallback(
    (objectName: string, _draft: InstallationConfigContent) => {
      // initialize provider if not set
      _draft.provider = _draft.provider || manifest?.content?.provider || "";
      const read = _draft.read || { objects: {} };
      const objects = read.objects || {};
      const obj = objects[objectName] || {};

      // initialize object name if not set
      obj.objectName = obj.objectName || objectName;

      // Apply field mapping defaults from amp.yaml manifest.
      // IntegrationFieldMapping._default specifies which provider field
      // should be pre-selected for a mapping. Only applied when no
      // existing selection exists, preserving user overrides.
      const readManifestObject = getReadObject(objectName);
      if (readManifestObject) {
        const allMapFields = [
          ...(readManifestObject.getRequiredMapFields() ?? []),
          ...(readManifestObject.getOptionalMapFields() ?? []),
        ];

        if (allMapFields.length > 0) {
          obj.selectedFieldMappings = obj.selectedFieldMappings || {};
          allMapFields.forEach((mapping) => {
            if (
              mapping._default &&
              !obj.selectedFieldMappings![mapping.mapToName]
            ) {
              obj.selectedFieldMappings![mapping.mapToName] = mapping._default;
            }
          });
        }
      }

      objects[objectName] = obj;
      read.objects = objects;
      _draft.read = read;

      return { read, objects, obj };
    },
    [manifest?.content?.provider, getReadObject],
  );

  /**
   * Removes an object from all actions (read, write) in the draft config. An `enabled: always`
   * read object keeps its read entry.
   */
  const removeObject = useCallback(
    (objectName: string) => {
      const keepRead = isAlwaysEnabled(objectName);
      setDraft((prev) =>
        produce(prev, (_draft) => {
          if (!keepRead && _draft.read?.objects?.[objectName]) {
            delete _draft.read.objects[objectName];
          }
          if (_draft.write?.objects?.[objectName]) {
            delete _draft.write.objects[objectName];
          }
        }),
      );
    },
    [isAlwaysEnabled],
  );

  const readObject = useCallback(
    (objectName: string): ReadObjectHandlers => ({
      object: draft.read?.objects?.[objectName],
      setEnableRead: () => {
        setDraft((prev) =>
          produce(prev, (_draft) => {
            const { obj } = initializeObjectWithDefaults(objectName, _draft);
            obj.disabled = false;
          }),
        );
      },
      setDisableRead: () => {
        if (isAlwaysEnabled(objectName)) {
          console.warn(
            `${objectName} is marked enabled: always and can't be disabled`,
          );
          return;
        }
        setDraft((prev) =>
          produce(prev, (_draft) => {
            const { obj } = initializeObjectWithDefaults(objectName, _draft);
            obj.disabled = true;
          }),
        );
      },
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

      deleteFieldMapping: (mapToName: string) => {
        setDraft((prev) =>
          produce(prev, (_draft) => {
            const selectedFieldMappings =
              _draft.read?.objects?.[objectName]?.selectedFieldMappings;

            if (selectedFieldMappings && mapToName in selectedFieldMappings) {
              delete selectedFieldMappings[mapToName];
            }
          }),
        );
      },
    }),
    [draft.read?.objects, initializeObjectWithDefaults, isAlwaysEnabled],
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
          getFieldSetting(fieldName, "default"),
        setDefaultValues: ({ fieldName, value }) =>
          setFieldSetting(fieldName, "default", value),
        getWriteOnCreateSetting: (fieldName: string) =>
          getFieldSetting(fieldName, "writeOnCreate"),
        setWriteOnCreateSetting: ({ fieldName, value }) =>
          setFieldSetting(fieldName, "writeOnCreate", value),
        getWriteOnUpdateSetting: (fieldName: string) =>
          getFieldSetting(fieldName, "writeOnUpdate"),
        setWriteOnUpdateSetting: ({ fieldName, value }) =>
          setFieldSetting(fieldName, "writeOnUpdate", value),
        setEnableDeletion: () => {
          setDraft((prev) =>
            produce(prev, (_draft) => {
              const { obj } = initializeWriteObject(_draft);
              obj.deletionSettings = { enabled: true };
            }),
          );
        },
        setDisableDeletion: () => {
          setDraft((prev) =>
            produce(prev, (_draft) => {
              const { obj } = initializeWriteObject(_draft);
              obj.deletionSettings = { enabled: false };
            }),
          );
        },
      };
    },
    [draft.write?.objects],
  );

  const proxy = useCallback(
    (): ProxyHandlers => ({
      object: draft.proxy,
      setEnableProxy: () => {
        setDraft((prev) =>
          produce(prev, (draft) => {
            draft.proxy = { enabled: true };
          }),
        );
      },
      setDisableProxy: () => {
        setDraft((prev) =>
          produce(prev, (draft) => {
            draft.proxy = { enabled: false };
          }),
        );
      },
      getProxyEnabled: () => {
        return draft.proxy?.enabled || false;
      },
    }),
    [draft.proxy],
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
    if (installation) {
      console.debug("Installation found", { installation });

      // initialize previous installation ref if not set
      if (!previousInstallationRef.current) {
        previousInstallationRef.current = installation;
        reset();
      } else {
        // Only reset if the installation object is strictly different
        if (!isEqual(previousInstallationRef.current, installation)) {
          console.debug("Installation changed, resetting config", {
            previous: previousInstallationRef.current,
            current: installation,
          });
          // sync the installation config to the local config
          reset();
          previousInstallationRef.current = installation;
        }
      }
    }
  }, [installation, reset]);

  const subscribeObject = useCallback(
    (objectName: string): SubscribeObjectHandlers => {
      const object = draft.subscribe?.objects?.[objectName];

      const initializeSubscribeObject = (_draft: InstallationConfigContent) => {
        const subscribe = _draft.subscribe || {};
        const objects = subscribe.objects || {};
        // Written out rather than left unset, since the server then falls back to the
        // manifest's inheritFieldsAndMapping. setInheritFieldsAndMappings overrides it for an
        // object that does inherit.
        const obj = objects[objectName] || {
          objectName,
          inheritFieldsAndMappings: false,
        };

        objects[objectName] = obj;
        subscribe.objects = objects;
        _draft.subscribe = subscribe;

        return { subscribe, objects, obj };
      };

      return {
        object,
        setEnableCreate: () => {
          setDraft((prev) =>
            produce(prev, (_draft) => {
              const { obj } = initializeSubscribeObject(_draft);
              obj.createEvent = {
                enabled: ConfigCreateEventEnabledEnum.Always,
              };
            }),
          );
        },
        setEnableDelete: () => {
          setDraft((prev) =>
            produce(prev, (_draft) => {
              const { obj } = initializeSubscribeObject(_draft);
              obj.deleteEvent = {
                enabled: ConfigDeleteEventEnabledEnum.Always,
              };
            }),
          );
        },
        setEnableUpdate: (watch) => {
          setDraft((prev) =>
            produce(prev, (_draft) => {
              const { obj } = initializeSubscribeObject(_draft);
              obj.updateEvent = {
                enabled: ConfigUpdateEventEnabledEnum.Always,
                ...(watch ?? {}),
              };
            }),
          );
        },
        setDisableUpdate: (watch) => {
          setDraft((prev) =>
            produce(prev, (_draft) => {
              const { obj } = initializeSubscribeObject(_draft);
              obj.updateEvent = {
                enabled: ConfigUpdateEventEnabledEnum.Never,
                ...(watch ?? {}),
              };
            }),
          );
        },
        setInheritFieldsAndMappings: (inherit: boolean) => {
          setDraft((prev) =>
            produce(prev, (_draft) => {
              const { obj } = initializeSubscribeObject(_draft);
              obj.inheritFieldsAndMappings = inherit;
            }),
          );
        },
        setSelectedFields: (fields: string[]) => {
          setDraft((prev) =>
            produce(prev, (_draft) => {
              const { obj } = initializeSubscribeObject(_draft);
              obj.selectedFields = fields.reduce<Record<string, boolean>>(
                (acc, field) => {
                  acc[field] = true;

                  return acc;
                },
                {},
              );
            }),
          );
        },
        setSelectedFieldMappings: (mappings: Record<string, string>) => {
          setDraft((prev) =>
            produce(prev, (_draft) => {
              const { obj } = initializeSubscribeObject(_draft);
              obj.selectedFieldMappings = { ...mappings };
            }),
          );
        },
        removeSubscribeObject: () => {
          setDraft((prev) =>
            produce(prev, (_draft) => {
              const objects = _draft.subscribe?.objects;
              if (objects) delete objects[objectName];
            }),
          );
        },
      };
    },
    [draft, setDraft],
  );

  return {
    draft,
    get,
    reset,
    setDraft,
    removeObject,
    readObject,
    writeObject,
    proxy,
    subscribeObject,
  };
}
