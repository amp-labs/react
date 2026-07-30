import { HydratedIntegrationFieldExistent } from "services/api";
import { useManifest } from "src/headless";
import { useProjectQuery } from "src/hooks/query";
import {
  getFieldDisplayName,
  isIntegrationFieldMapping,
} from "src/utils/manifest";

import { Tag } from "components/ui-base/Tag";

import { useSelectedConfigureState } from "../useSelectedConfigureState";

import { FieldHeader } from "./FieldHeader";
import { ObjectErrorAlert } from "./ObjectErrorAlert";

export function RequiredFields() {
  const { data: hydratedRevision } = useManifest();
  const { selectedObjectName } = useSelectedConfigureState();
  const { appName } = useProjectQuery();

  const selectedObject = hydratedRevision?.content?.read?.objects?.find(
    (obj) => obj.objectName === selectedObjectName,
  );

  const error = selectedObject?.error;
  const requiredFields = selectedObject?.requiredFields;

  if (error) {
    return <ObjectErrorAlert error={error} />;
  }

  return (
    <>
      <FieldHeader string={`${appName} reads the following fields`} />
      <div
        style={{
          display: "flex",
          gap: ".5rem",
          marginBottom: ".5rem",
          flexWrap: "wrap",
        }}
      >
        {requiredFields?.length
          ? requiredFields
              .filter(
                (field): field is HydratedIntegrationFieldExistent =>
                  !isIntegrationFieldMapping(field),
              )
              // the server sorts by its own displayName, which is not what we
              // render, so re-sort by the label the user actually sees
              .sort((a, b) =>
                getFieldDisplayName(a).localeCompare(getFieldDisplayName(b)),
              )
              .map((field) => (
                <Tag key={field.fieldName}>{getFieldDisplayName(field)}</Tag>
              ))
          : "There are no required fields."}
      </div>
    </>
  );
}
