import { useMemo } from "react";
import { useManifest } from "src/headless";
import { isReadObjectAlwaysEnabled } from "src/utils/manifest";

/**
 * Returns the names of the read objects the integration marks `enabled: always` in amp.yaml.
 * Every installation reads these objects, so consumers can't deselect or disable them.
 * The set is empty until the manifest has loaded.
 */
export function useAlwaysEnabledReadObjects(): Set<string> {
  const { getReadObjects } = useManifest();

  return useMemo(
    () =>
      new Set(
        getReadObjects()
          .filter(isReadObjectAlwaysEnabled)
          .map((obj) => obj.objectName),
      ),
    [getReadObjects],
  );
}
