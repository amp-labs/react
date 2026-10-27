import { useEffect, useRef } from "react";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { useLocalConfig } from "src/headless";
import {
  autoAppliedSubscribeEvents,
  updateEventWatchSpec,
} from "src/types/subscribeEvents";

/**
 * Writes the subscribe events the consumer is not asked about into the config draft.
 *
 * An event present in `subscribeEvents` is subscribed to; an omitted event is not. Events
 * with `userSelect: false` are settled here, before any step renders, because there is no
 * question to put to the consumer. Events with `userSelect: true` are left for the wizard
 * to ask about and are deliberately untouched.
 *
 * For an update event, "not asked" means watching the fields the caller named, or every
 * field when it named none. The server requires one of `requiredWatchFields` or
 * `watchFieldsAuto` on a config update event, so there is no third option that stays
 * quiet; see `updateEventWatchSpec`.
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

      handlers.setInheritFieldsAndMappings(
        events.inheritFieldsAndMappings ?? false,
      );

      // Fields first: the events below are only valid on an object that selects something.
      if (events.selectedFields?.length) {
        handlers.setSelectedFields(events.selectedFields);
      }

      if (events.selectedFieldMappings) {
        handlers.setSelectedFieldMappings(events.selectedFieldMappings);
      }

      autoAppliedSubscribeEvents({ [objectName]: events }).forEach(
        ({ event }) => {
          if (event === "createEvent") handlers.setEnableCreate();
          if (event === "deleteEvent") handlers.setEnableDelete();
          // Watch the named fields, or everything when none were named; see above.
          if (event === "updateEvent") {
            handlers.setEnableUpdate(updateEventWatchSpec(events));
          }
        },
      );
    });
  }, [subscribeEvents, subscribeObject]);
}
