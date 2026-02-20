import { useManifest } from "src/headless";
import { useProjectQuery } from "src/hooks/query";
import { isIntegrationFieldMapping } from "src/utils/manifest";

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
          ? requiredFields.map((field) => {
              if (isIntegrationFieldMapping(field)) return null;
              return <Tag key={field.fieldName}>{field.displayName}</Tag>;
            })
          : "There are no required fields."}
      </div>
    </>
  );
}
