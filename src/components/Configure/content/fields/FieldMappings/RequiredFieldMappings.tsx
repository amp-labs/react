import { useMemo } from "react";

import { ErrorBoundary, useErrorState } from "context/ErrorContextProvider";
import { FormControl } from "src/components/form/FormControl";

import { useSelectedConfigureState } from "../../useSelectedConfigureState";
import { FieldHeader } from "../FieldHeader";

import { DUPLICATE_FIELD_ERROR_MESSAGE, FieldMapping } from "./FieldMapping";
import { setFieldMapping } from "./setFieldMapping";

export function RequiredFieldMappings() {
  const { selectedObjectName, configureState, setConfigureState } = useSelectedConfigureState();
  const {
 isError, removeError, getError, setError
} = useErrorState();
  const selectedFieldMappings = configureState?.read?.selectedFieldMappings;
  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    if (!value) {
      // if place holder value is chosen, we don't change state
      return;
    }

    if (
      selectedFieldMappings
      && selectedObjectName
      && Object.values(selectedFieldMappings).some(
        (mapping) => mapping === value && mapping !== name
      )
    ) {
      console.error(
        "Each field must be mapped to a unique value in RequiredFields",
        selectedFieldMappings
      );
      const keysForValue = [
        name,
        ...(Object.keys(selectedFieldMappings).filter(
          (key) => selectedFieldMappings[key] === value
        ) || []),
      ];

      // set the keys for which duplicate values are found
      setError(ErrorBoundary.MAPPING, selectedObjectName, keysForValue);
      return;
    }

    if (selectedObjectName) {
      setFieldMapping(selectedObjectName, setConfigureState, [
        {
          field: name,
          value,
        },
      ]);
    }

    if (isError(ErrorBoundary.MAPPING, name)) {
      removeError(ErrorBoundary.MAPPING, name);
    }

    // reset duplicate value errors for the selected object
    if (
      selectedObjectName
      && isError(ErrorBoundary.MAPPING, selectedObjectName)
    ) {
      removeError(ErrorBoundary.MAPPING, selectedObjectName);
    }
  };

  const integrationFieldMappings = useMemo(
    () => configureState?.read?.requiredMapFields || [],
    [configureState]
  );

  const errors = getError(ErrorBoundary.MAPPING, selectedObjectName!);
  return integrationFieldMappings?.length ? (
    <>
      <FieldHeader string="Map the following fields" />
      <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
        {integrationFieldMappings.map((field) => (
          <FormControl
            id={field.mapToName}
            key={field.mapToName}
            isInvalid={isError(ErrorBoundary.MAPPING, field.mapToName)}
            errorMessage="* required"
          >
            <FieldMapping
              allFields={configureState?.read?.allFields || []}
              field={field}
              onSelectChange={onSelectChange}
              hasError={
                Array.isArray(errors) && errors.includes(field.mapToName)
              }
              errorMessage={DUPLICATE_FIELD_ERROR_MESSAGE}
            />
          </FormControl>
        ))}
      </div>
    </>
  ) : null;
}
