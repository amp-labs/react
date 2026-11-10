import { useEffect, useRef } from "react";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { useLocalConfig } from "src/headless";
import {
  autoAppliedSubscribeEvents,
  updateEventWatchSpec,
} from "src/types/subscribeEvents";

/**
 * Writes the caller's `subscribeEvents` into the wizard's config draft.
 *
 * An event present in `subscribeEvents` is written to the config. An omitted event is left out,
 * so the manifest decides whether the object is subscribed to it. The consumer is not asked
 * about either.
 */
export function useApplySubscribeEvents() {
  const { subscribeEvents } = useInstallIntegrationProps();
  const { subscribeObject } = useLocalConfig();
  const applied = useRef(new Set<string>());

  useEffect(() => {
    if (!subscribeEvents) return;

    Object.entries(subscribeEvents).forEach(([objectName, events]) => {
      if (applied.current.has(objectName)) return;
      applied.current.add(objectName);

      const handlers = subscribeObject(objectName);

      handlers.setInheritFieldsAndMappings(events.inheritFieldsAndMappings);

      autoAppliedSubscribeEvents({ [objectName]: events }).forEach(
        ({ event }) => {
          if (event === "createEvent") handlers.setEnableCreate();
          if (event === "deleteEvent") handlers.setEnableDelete();
          // Watch the named fields, or everything when none were named; see updateEventWatchSpec.
          if (event === "updateEvent") {
            const watch = updateEventWatchSpec(events.updateEvent);

            if (events.updateEvent?.enabled === false) {
              handlers.setDisableUpdate(watch);
            } else {
              handlers.setEnableUpdate(watch);
            }
          }
        },
      );
    });
  }, [subscribeEvents, subscribeObject]);
}
