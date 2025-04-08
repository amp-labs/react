import {
  createContext, ReactNode, useCallback, useContext, useState,
} from 'react';
import type { BaseReadConfigObject, UpdateInstallationConfigContent } from '@generated/api/src';
import { produce } from 'immer';

type ReadObjectHandlers = {
  object: BaseReadConfigObject | undefined;
  getSelectedField: (fieldName: string) => boolean;
  setSelectedField: (params: { fieldName: string; selected: boolean }) => void;
  getFieldMapping: (fieldName: string) => string | undefined;
  setFieldMapping: (params: { fieldName: string; mapToName: string }) => void;
};

export function useConfigHelper(initialConfig: UpdateInstallationConfigContent) {
  const [draft, setDraft] = useState<UpdateInstallationConfigContent>(initialConfig);
  const [initial] = useState(initialConfig); // For reset

  const get = useCallback(() => draft, [draft]);

  const reset = useCallback(() => {
    setDraft(initial);
  }, [initial]);

  const readObject = useCallback(
    (key: string): ReadObjectHandlers => ({
      object: draft.read?.objects?.[key],
      getSelectedField: (fieldName: string) => !!draft.read?.objects?.[key]?.selectedFields?.[fieldName],

      // sets a single field selected boolean, deletes the field if selected is false
      setSelectedField: ({ fieldName, selected }) => {
        setDraft((prev) => produce(prev, (_draft) => {
          // initialize read if it doesn't exist
          const read = _draft.read || {};
          const objects = read.objects || {};
          const obj = objects[key] || {};
          // initialize selectedFields if it doesn't exist
          obj.selectedFields = obj.selectedFields || {};
          obj.selectedFields[fieldName] = selected;
          objects[key] = obj;
          read.objects = objects;

          // if selected is false, remove the field from selectedFields
          if (obj.selectedFields?.[fieldName] === false) {
            delete obj.selectedFields[fieldName];
          }

          // eslint-disable-next-line no-param-reassign
          _draft.read = read;
          return _draft;
        }));
      },

      getFieldMapping: (mapToName: string) => draft.read?.objects?.[key]?.selectedFieldMappings?.[mapToName],

      setFieldMapping: ({ fieldName, mapToName }) => {
        setDraft((prev) => produce(prev, (_draft) => {
          const obj = _draft.read?.objects?.[key];
          if (obj) {
            if (!obj.selectedFieldMappings) obj.selectedFieldMappings = {};
            obj.selectedFieldMappings[mapToName] = fieldName;
          }
        }));
      },
    }),
    [draft],
  );

  return {
    draft,
    get,
    setDraft,
    reset,
    readObject,
  };
}

const ConfigContext = createContext<ReturnType<typeof useConfigHelper> | null>(null);

export function ConfigProvider({
  children,
  initialConfig,
}: {
  children: ReactNode;
  initialConfig: UpdateInstallationConfigContent;
}) {
  const config = useConfigHelper(initialConfig);
  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfigContext must be used within a ConfigProvider / InstallationProvider');
  }
  return context;
}
