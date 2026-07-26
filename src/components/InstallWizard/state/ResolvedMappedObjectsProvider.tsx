import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ObjectMetadata } from "@generated/api/src";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { useHydratedRevisionQuery } from "src/headless/manifest/useHydratedRevisionQuery";

export type ResolvedMappedObject = {
  resolvedObjectName: string;
  metadata?: ObjectMetadata;
};

type ResolvedMappedObjectsContextValue = {
  getResolution: (mapToName: string) => ResolvedMappedObject | undefined;
  setResolution: (mapToName: string, payload: ResolvedMappedObject) => void;
  clearResolution: (mapToName: string) => void;
  /** mapToName → resolvedObjectName, for components that need to enumerate resolutions. */
  resolutions: Record<string, ResolvedMappedObject>;
};

const ResolvedMappedObjectsContext = createContext<
  ResolvedMappedObjectsContextValue | undefined
>(undefined);

export function ResolvedMappedObjectsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [resolutions, setResolutions] = useState<
    Record<string, ResolvedMappedObject>
  >({});

  const { installation } = useInstallIntegrationProps();
  const { data: hydratedRevision } = useHydratedRevisionQuery();
  const seededRef = useRef(false);

  // Seed once from an existing Installation's config: if the config contains an
  // objectName that has no matching manifest object but corresponds to a manifest
  // object's mapToName, treat it as previously resolved.
  useEffect(() => {
    if (seededRef.current) return;
    if (!installation || !hydratedRevision) return;

    const readObjects = hydratedRevision.content?.read?.objects ?? [];
    const unresolvedMapToNames = readObjects
      .filter((obj) => !obj.objectName && !!obj.mapToName)
      .map((obj) => obj.mapToName as string);

    if (unresolvedMapToNames.length === 0) {
      seededRef.current = true;
      return;
    }

    const configReadObjects = installation.config?.content?.read?.objects ?? {};
    const manifestObjectNames = new Set(
      readObjects.map((o) => o.objectName).filter(Boolean) as string[],
    );

    // Config entries that don't correspond to a concrete manifest objectName
    // are candidates for a previously resolved mapped object.
    const leftoverConfigKeys = Object.keys(configReadObjects).filter(
      (key) => !manifestObjectNames.has(key),
    );

    // Heuristic: if counts match, pair them in manifest-declaration order.
    // This works for the common case (1 unresolved mapped object) without
    // depending on the backend echoing mapToName on the config entry.
    if (leftoverConfigKeys.length !== unresolvedMapToNames.length) {
      seededRef.current = true;
      return;
    }

    const seeded: Record<string, ResolvedMappedObject> = {};
    unresolvedMapToNames.forEach((mapToName, idx) => {
      seeded[mapToName] = {
        resolvedObjectName: leftoverConfigKeys[idx],
      };
    });

    setResolutions((prev) => ({ ...seeded, ...prev }));
    seededRef.current = true;
  }, [installation, hydratedRevision]);

  const getResolution = useCallback(
    (mapToName: string) => resolutions[mapToName],
    [resolutions],
  );

  const setResolution = useCallback(
    (mapToName: string, payload: ResolvedMappedObject) => {
      setResolutions((prev) => ({ ...prev, [mapToName]: payload }));
    },
    [],
  );

  const clearResolution = useCallback((mapToName: string) => {
    setResolutions((prev) => {
      const next = { ...prev };
      delete next[mapToName];
      return next;
    });
  }, []);

  const value = useMemo<ResolvedMappedObjectsContextValue>(
    () => ({ getResolution, setResolution, clearResolution, resolutions }),
    [getResolution, setResolution, clearResolution, resolutions],
  );

  return (
    <ResolvedMappedObjectsContext.Provider value={value}>
      {children}
    </ResolvedMappedObjectsContext.Provider>
  );
}

export function useResolvedMappedObjects(): ResolvedMappedObjectsContextValue {
  const ctx = useContext(ResolvedMappedObjectsContext);
  if (!ctx) {
    throw new Error(
      "useResolvedMappedObjects must be used inside ResolvedMappedObjectsProvider",
    );
  }
  return ctx;
}

const emptyResolutions: Record<string, ResolvedMappedObject> = {};
const noopSet = () => {};
const noopClear = () => {};
const emptyValue: ResolvedMappedObjectsContextValue = {
  getResolution: () => undefined,
  setResolution: noopSet,
  clearResolution: noopClear,
  resolutions: emptyResolutions,
};

/**
 * Variant that does NOT throw when the provider is absent. Use from hooks/components
 * that may render outside the InstallWizard tree (e.g. the standalone Configure flow).
 */
export function useOptionalResolvedMappedObjects(): ResolvedMappedObjectsContextValue {
  return useContext(ResolvedMappedObjectsContext) ?? emptyValue;
}
