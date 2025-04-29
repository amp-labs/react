import { HydratedIntegrationWriteObject } from "@generated/api/src";
import { useHydratedRevision } from "src/components/Configure/state/HydratedRevisionContext";

import { useSelectedConfigureState } from "../../useSelectedConfigureState";
import { FieldHeader } from "../FieldHeader";

import { FieldDefaultValueTable } from "./FieldDefaultValueTable";

// checks if the object supports default values from hydratedRevision
const isFieldDefaultValueSupported = (
  objectName: string,
  writeObjects: HydratedIntegrationWriteObject[],
) =>
  !!writeObjects.find(
    (writeObject) =>
      writeObject.objectName === objectName &&
      writeObject?.valueDefaults?.allowAnyFields,
  );

export function FieldDefaultValueMapping() {
  const { configureState } = useSelectedConfigureState();

  const { writeObjects } = useHydratedRevision();
  const selectedWriteObjects = configureState?.write?.selectedWriteObjects;
  const shouldRender = !!writeObjects;

  return (
    shouldRender && (
      <>
        {writeObjects.map((field) => {
          // only render default value if the object has write access.
          if (
            selectedWriteObjects?.[field.objectName] &&
            // check to hydrated revision for support - valueDefaults.allowAnyFields
            isFieldDefaultValueSupported(field.objectName, writeObjects)
          ) {
            return (
              <>
                <FieldHeader string={`Defaults for ${field.displayName} `} />
                <FieldDefaultValueTable objectName={field.objectName} />
              </>
            );
          }
          return null;
        })}
      </>
    )
  );
}
