import isEqual from "lodash.isequal";

type SubscribeObjects = Record<string, unknown>;

/**
 * Update-mask paths for the subscribe objects an update should write: the ones in `draft` that
 * the installation does not have yet, or has with different contents.
 *
 * Unchanged objects are left out, so saving an unrelated change does not resend a subscribe
 * object the caller did not touch.
 */
export function subscribeObjectUpdateMasks(
  draft: SubscribeObjects | undefined,
  current: SubscribeObjects | undefined,
): string[] {
  return Object.entries(draft ?? {})
    .filter(
      ([name, object]) =>
        !isEqual(toJSONValue(object), toJSONValue(current?.[name])),
    )
    .map(([name]) => `config.content.subscribe.objects.${name}`);
}

// Drops keys whose value is undefined, which the generated FromJSON models add for every
// absent optional field, so they do not count as a difference.
function toJSONValue(value: unknown): unknown {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}
