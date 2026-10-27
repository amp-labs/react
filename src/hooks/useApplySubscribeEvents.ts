import { useEffect, useRef } from "react";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import { useLocalConfig } from "src/headless";
import { autoAppliedSubscribeEvents } from "src/types/subscribeEvents";

/**
 * Writes the subscribe events the consumer is not asked about into the config draft.
 *
 * An event present in `subscribeEvents` is subscribed to; an omitted event is not. Events
 * with `userSelect: false` are settled here, before any step renders, because there is no
 * question to put to the consumer. Events with `userSelect: true` are left for the wizard
 * to ask about and are deliberately untouched.
 *
 * For an update event, "not asked" means every field is watched: a subscribe-only object
 * has no read config to inherit a field set from, so an update event with no watch
 * preference resolves to an empty watch set server-side and drops every update.
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

      autoAppliedSubscribeEvents({ [objectName]: events }).forEach(
        ({ event }) => {
          if (event === "createEvent") handlers.setEnableCreate();
          if (event === "deleteEvent") handlers.setEnableDelete();
          // Not asked means every field is watched; see above.
          if (event === "updateEvent") {
            handlers.setEnableUpdate({ watchAllFields: true });
          }
        },
      );
    });
  }, [subscribeEvents, subscribeObject]);
}
