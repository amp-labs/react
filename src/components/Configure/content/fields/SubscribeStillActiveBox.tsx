import { SubscribeConfigObject } from "@generated/api/src";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { FormSuccessBox } from "src/components/FormSuccessBox";

interface SubscribeStillActiveBoxProps {
  subscribeObject: SubscribeConfigObject;
  objectDisplayName: string;
}

function getSubscribedEventLabels(
  subscribeObject: SubscribeConfigObject,
): string[] {
  const labels: string[] = [];
  if (subscribeObject.createEvent) labels.push("Created");
  if (subscribeObject.updateEvent) labels.push("Updated");
  if (subscribeObject.deleteEvent) labels.push("Deleted");
  if (subscribeObject.otherEvents?.length)
    labels.push(...subscribeObject.otherEvents);
  return labels;
}

export function SubscribeStillActiveBox({
  subscribeObject,
  objectDisplayName,
}: SubscribeStillActiveBoxProps) {
  const events = getSubscribedEventLabels(subscribeObject);

  return (
    <FormSuccessBox style={{ marginTop: "0.75rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <CheckCircledIcon
          style={{
            width: "16px",
            height: "16px",
            flexShrink: 0,
          }}
        />
        <span style={{ fontWeight: 600 }}>
          Event subscriptions are still active
        </span>
      </div>
      <p style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>
        You&apos;ll continue to receive <b>{objectDisplayName}</b> events even
        though reading is disabled.
      </p>
      {events.length > 0 && (
        <p style={{ marginTop: "0.25rem", fontSize: "0.875rem" }}>
          <span style={{ fontWeight: 600 }}>Subscribed events: </span>
          {events.join(", ")}
        </p>
      )}
      <p
        style={{
          marginTop: "0.5rem",
          fontSize: "0.75rem",
          opacity: 0.75,
        }}
      >
        This reflects configured subscriptions and does not confirm event
        delivery.
      </p>
    </FormSuccessBox>
  );
}
