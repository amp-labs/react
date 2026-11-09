import { useEffect, useRef } from "react";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { useLocalConfig } from "src/headless";
import {
  autoAppliedSubscribeEvents,
  updateEventWatchSpec,
} from "src/types/subscribeEvents";

/**
 * Writes the caller's `subscribeEvents` into the wizard's config draft. Select Objects calls it.
 *
 * An event present in `subscribeEvents` is written to the config. An omitted event is left out,
 * so the manifest decides whether the object is subscribed to it. The consumer is not asked
 * about either.
 *
 * An update event watches the fields the caller named on it, or every field when it named
 * none, which only an inheriting object may do. The server rejects a config update event that
 * has neither `requiredWatchFields` nor `watchFieldsAuto`, so it cannot watch no fields; see
 * `updateEventWatchSpec`. With `enabled: false` the event is written as `never`; on a
 * non-inheriting object its watch fields still name the fields the other events deliver.
 *
 * Runs once per object. The draft is the user's from then on, so re-applying would undo
 * their edits.
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
          // Watch the named fields, or everything when none were named; see above.
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
