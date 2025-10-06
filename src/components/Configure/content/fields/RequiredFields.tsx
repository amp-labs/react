import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useManifest } from "src/headless";
import { useProjectQuery } from "src/hooks/query";

import { Tag } from "components/ui-base/Tag";

import { isIntegrationFieldMapping } from "../../utils";
import { useSelectedConfigureState } from "../useSelectedConfigureState";

import { FieldHeader } from "./FieldHeader";

import classes from "./requiredFields.module.css";

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
    return (
      <div className={classes.errorAlert}>
        <div className={classes.errorHeader}>
          <ExclamationTriangleIcon className={classes.errorIcon} />
          <span className={classes.errorTitle}>Unable to load object</span>
        </div>
        <div className={classes.errorMessage}>{error}</div>
      </div>
    );
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
              if (!isIntegrationFieldMapping(field)) {
                return <Tag key={field.fieldName}>{field.displayName}</Tag>;
              }
              return null; // fallback for customed mapped fields
            })
          : "There are no required fields."}
      </div>
    </>
  );
}
