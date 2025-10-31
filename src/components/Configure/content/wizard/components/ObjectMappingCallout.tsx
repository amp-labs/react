/**
 * ObjectMappingCallout - Displays object-level mapping information
 *
 * Shows how the object in the user's app maps to the provider's object.
 * For example: "Contacts in MyApp is mapped to Leads in Salesforce"
 */

import { FormCalloutBox } from "src/components/FormCalloutBox";
import { useManifest } from "src/headless/manifest/useManifest";
import { useProjectQuery } from "src/hooks/query";
import { capitalize } from "src/utils";

interface ObjectMappingCalloutProps {
  objectName: string;
}

export function ObjectMappingCallout({
  objectName,
}: ObjectMappingCalloutProps) {
  const { data: project } = useProjectQuery();
  const { getReadObject, data: manifest } = useManifest();

  const providerName = manifest?.content?.provider;
  const appName = project?.appName;

  const selectedReadObject = getReadObject(objectName);
  const objectDisplayName =
    selectedReadObject.object?.displayName || capitalize(objectName);

  const mapToName = selectedReadObject.object?.mapToName;
  const mapToDisplayName =
    selectedReadObject.object?.mapToDisplayName ||
    (mapToName && capitalize(mapToName));

  // Only show if there's an object mapping
  if (!mapToDisplayName || !appName || !providerName) {
    return null;
  }

  return (
    <FormCalloutBox style={{ marginTop: "1rem" }}>
      <p style={{ margin: "1rem 0" }}>
        <b>{mapToDisplayName}</b> in {appName} is mapped to{" "}
        <b>{objectDisplayName}</b> in {providerName}.
      </p>
    </FormCalloutBox>
  );
}
