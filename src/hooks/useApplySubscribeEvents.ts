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
 * For an update event, "not asked" means every field is watched - but only when the caller
 * named no fields. `selectedFields` and `selectedFieldMappings` are themselves the set of
 * fields to watch, so `watchFieldsAuto: "all"` on top of them would contradict them; it is
 * left unset and the server treats the object's own fields as the watch set.
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

      // Fields first: the events below are only valid on an object that selects something.
      if (events.selectedFields?.length) {
        handlers.setSelectedFields(events.selectedFields);
      }

      if (events.selectedFieldMappings) {
        handlers.setSelectedFieldMappings(events.selectedFieldMappings);
      }

      const hasSelectedFields =
        Boolean(events.selectedFields?.length) ||
        Object.keys(events.selectedFieldMappings ?? {}).length > 0;

      autoAppliedSubscribeEvents({ [objectName]: events }).forEach(
        ({ event }) => {
          if (event === "createEvent") handlers.setEnableCreate();
          if (event === "deleteEvent") handlers.setEnableDelete();
          // Watch everything only when nothing was named; see above.
          if (event === "updateEvent") {
            handlers.setEnableUpdate({ watchAllFields: !hasSelectedFields });
          }
        },
      );
    });
  }, [subscribeEvents, subscribeObject]);
}
