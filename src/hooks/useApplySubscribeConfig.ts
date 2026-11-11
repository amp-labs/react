import { useEffect, useRef } from "react";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { useLocalConfig } from "src/headless";

/**
 * Writes the caller's `subscribeConfig` into the wizard's config draft, one subscribe object per
 * key. The consumer is not asked about it.
 *
 * An event the config leaves out is left out of the installation, so the manifest decides it.
 */
export function useApplySubscribeConfig() {
  const { subscribeConfig } = useInstallIntegrationProps();
  const { subscribeObject } = useLocalConfig();
  // subscribeObject changes on every draft edit, which re-runs this effect; the ref stops it
  // rewriting an object it has already written.
  const applied = useRef(new Set<string>());

  useEffect(() => {
    if (!subscribeConfig) return;

    Object.entries(subscribeConfig).forEach(([objectName, config]) => {
      if (applied.current.has(objectName)) return;
      applied.current.add(objectName);

      subscribeObject(objectName).setConfig(config);
    });
  }, [subscribeConfig, subscribeObject]);
}
