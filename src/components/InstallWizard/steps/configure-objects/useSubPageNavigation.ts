import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useManifest } from "src/headless";

import { useWizard } from "../../wizard/WizardContext";

import type { SubPage } from "./subPageUtils";
import { getInitialSubPage, getLastSubPage, getSubPages } from "./subPageUtils";

export function useSubPageNavigation() {
  const manifest = useManifest();
  const {
    state,
    isFirstObject,
    isLastObject,
    currentObjectName,
    nextObject,
    prevObject,
    nextStep,
    prevStep,
    setCurrentObjectIndex,
  } = useWizard();

  const { selectedObjects, currentObjectIndex } = state;

  // Local sub-page state — initialize from the manifest so we don't land on
  // a sub-page the object doesn't have (e.g. "fields" when the object only
  // has mappings).
  const [subPage, setSubPage] = useState<SubPage>(() =>
    currentObjectName
      ? getInitialSubPage(manifest, currentObjectName)
      : "fields",
  );
  const pendingSubPageRef = useRef<SubPage | null>(null);
  const prevObjectNameRef = useRef(currentObjectName);

  // Reset sub-page only when the current object actually changes.
  // If a pending override exists (from backward navigation), use it instead.
  useEffect(() => {
    if (currentObjectName === prevObjectNameRef.current) return;
    prevObjectNameRef.current = currentObjectName;

    if (pendingSubPageRef.current !== null) {
      setSubPage(pendingSubPageRef.current);
      pendingSubPageRef.current = null;
    } else if (currentObjectName) {
      setSubPage(getInitialSubPage(manifest, currentObjectName));
    }
  }, [currentObjectName, manifest]);

  // Derived booleans for current object
  const currentManifestObject = useMemo(() => {
    if (!currentObjectName) return null;
    return manifest.getReadObject(currentObjectName);
  }, [manifest, currentObjectName]);

  const hasMappings = useMemo(() => {
    const required = currentManifestObject?.getRequiredMapFields()?.length ?? 0;
    const optional = currentManifestObject?.getOptionalMapFields()?.length ?? 0;
    return required > 0 || optional > 0;
  }, [currentManifestObject]);

  // Mirrors the check in getSubPages(): an object has an "additional" page if
  // it has explicit optionalFields OR auto-discovered customer fields (e.g.
  // from `optionalFieldsAuto: all`).
  const hasOptionalFields = useMemo(() => {
    const hasExplicit =
      (currentManifestObject?.getOptionalFields("no-mappings")?.length ?? 0) >
      0;
    const hasAuto =
      !!currentObjectName &&
      Object.keys(
        manifest.getCustomerFieldsForObject(currentObjectName).allFields ?? {},
      ).length > 0;
    return hasExplicit || hasAuto;
  }, [currentManifestObject, manifest, currentObjectName]);

  const hasFieldsContent = useMemo(() => {
    const hasRequiredFields =
      (currentManifestObject?.getRequiredFields("no-mappings")?.length ?? 0) >
      0;
    const hasObjectMapping = !!currentManifestObject?.object?.mapToName;
    return hasRequiredFields || hasObjectMapping;
  }, [currentManifestObject]);

  // Sub-page-aware navigation
  const handleNext = useCallback(() => {
    if (subPage === "fields") {
      if (hasMappings) {
        setSubPage("mappings");
        return;
      }
      if (hasOptionalFields) {
        setSubPage("additional");
        return;
      }
    } else if (subPage === "mappings") {
      if (hasOptionalFields) {
        setSubPage("additional");
        return;
      }
    }
    // subPage === "additional" or no more sub-pages
    if (isLastObject) {
      nextStep();
    } else {
      nextObject();
    }
  }, [
    subPage,
    hasMappings,
    hasOptionalFields,
    isLastObject,
    nextStep,
    nextObject,
  ]);

  // Navigate backward through sub-pages and objects
  const handleBack = useCallback(() => {
    if (subPage === "additional") {
      if (hasMappings) {
        setSubPage("mappings");
        return;
      }
      if (hasFieldsContent) {
        setSubPage("fields");
        return;
      }
    } else if (subPage === "mappings") {
      if (hasFieldsContent) {
        setSubPage("fields");
        return;
      }
    }
    // subPage === "fields" or no previous sub-pages
    if (isFirstObject) {
      prevStep();
    } else {
      const prevIndex = currentObjectIndex - 1;
      const prevObjName = selectedObjects[prevIndex];
      if (prevObjName) {
        pendingSubPageRef.current = getLastSubPage(manifest, prevObjName);
      }
      prevObject();
    }
  }, [
    subPage,
    hasMappings,
    hasFieldsContent,
    isFirstObject,
    prevStep,
    currentObjectIndex,
    selectedObjects,
    manifest,
    prevObject,
  ]);

  // Object tabs — page tracking
  const currentObjectPages = useMemo(
    () => (currentObjectName ? getSubPages(manifest, currentObjectName) : []),
    [manifest, currentObjectName],
  );
  const currentPageIndex = currentObjectPages.indexOf(subPage);

  const handleTabClick = useCallback(
    (objIndex: number) => {
      if (objIndex >= currentObjectIndex) return;
      // Navigate to a completed object — land on its last sub-page
      const objName = selectedObjects[objIndex];
      if (objName) {
        pendingSubPageRef.current = getLastSubPage(manifest, objName);
      }
      setCurrentObjectIndex(objIndex);
    },
    [currentObjectIndex, selectedObjects, manifest, setCurrentObjectIndex],
  );

  return {
    subPage,
    currentPageIndex,
    currentManifestObject,
    hasFieldsContent,
    handleNext,
    handleBack,
    handleTabClick,
  };
}
