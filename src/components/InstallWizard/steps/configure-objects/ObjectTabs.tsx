import { useMemo } from "react";
import { useManifest } from "src/headless";
import { isUnresolvedReadObject } from "src/utils/manifest";

import { useWizard } from "../../wizard/WizardContext";

import { getSubPages } from "./subPageUtils";

import styles from "./objectTabs.module.css";

interface ObjectTabsProps {
  currentPageIndex: number;
  onTabClick: (objIndex: number) => void;
}

export function ObjectTabs({ currentPageIndex, onTabClick }: ObjectTabsProps) {
  const manifest = useManifest();
  const { state } = useWizard();
  const { selectedObjects, currentObjectIndex } = state;

  const objectTabs = useMemo(() => {
    return selectedObjects.map((objName, objIndex) => {
      const pages = getSubPages(manifest, objName);
      const object = manifest.getReadObject(objName)?.object ?? null;
      const isUnresolved = !!object && isUnresolvedReadObject(object);
      const displayName = isUnresolved
        ? (object?.mapToDisplayName ?? object?.mapToName ?? objName)
        : object?.displayName || objName;

      const dots = pages.map((_, pageIdx) => {
        if (objIndex < currentObjectIndex) return "complete" as const;
        if (objIndex === currentObjectIndex) {
          if (pageIdx < currentPageIndex) return "complete" as const;
          if (pageIdx === currentPageIndex) return "active" as const;
          return "pending" as const;
        }
        return "pending" as const;
      });

      return { objName, displayName, dots, objIndex, isUnresolved };
    });
  }, [selectedObjects, manifest, currentObjectIndex, currentPageIndex]);

  return (
    <div className={styles.objectTabs}>
      {objectTabs.map((tab) => (
        <button
          key={tab.objName}
          type="button"
          className={`${styles.objectTab}${tab.objIndex === currentObjectIndex ? ` ${styles.objectTabActive}` : ""}`}
          disabled={tab.objIndex > currentObjectIndex}
          onClick={() => onTabClick(tab.objIndex)}
        >
          <span className={styles.objectTabLabel}>
            {tab.displayName}
            {tab.isUnresolved && (
              <span className={styles.needsSetupBadge}>Needs setup</span>
            )}
          </span>
          <span className={styles.objectTabDots}>
            {tab.dots.map((status, dotIdx) => (
              <span
                key={dotIdx}
                className={`${styles.dot} ${
                  status === "complete"
                    ? styles.dotComplete
                    : status === "active"
                      ? styles.dotActive
                      : styles.dotPending
                }`}
              />
            ))}
          </span>
        </button>
      ))}
    </div>
  );
}
