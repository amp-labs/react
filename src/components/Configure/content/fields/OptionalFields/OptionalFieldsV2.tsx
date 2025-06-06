import { useMemo } from "react";
import { HydratedIntegrationFieldExistent } from "services/api";

import {
  CheckboxItem,
  CheckboxPagination,
} from "components/ui-base/Checkbox/CheckboxPagination";

import { isIntegrationFieldMapping } from "../../../utils";
import { useSelectedConfigureState } from "../../useSelectedConfigureState";
import { FieldHeader } from "../FieldHeader";

import { setOptionalField } from "./setOptionalField";

export function OptionalFieldsV2() {
  const { appName, configureState, setConfigureState, selectedObjectName } =
    useSelectedConfigureState();
  const selectedOptionalFields = configureState?.read?.selectedOptionalFields;
  const readOptionalFields = configureState?.read?.optionalFields;

  const onCheckboxChange = (id: string, checked: boolean) => {
    if (selectedObjectName && configureState) {
      setOptionalField(selectedObjectName, setConfigureState, id, checked);
    }
  };

  const onSelectAllCheckboxChange = (checked: boolean) => {
    if (selectedObjectName && readOptionalFields) {
      readOptionalFields.forEach((field) => {
        if (!isIntegrationFieldMapping(field)) {
          setOptionalField(
            selectedObjectName,
            setConfigureState,
            field.fieldName,
            checked,
          );
        }
      });
    }
  };

  const checkboxItems = useMemo<CheckboxItem[]>(
    () =>
      // optional fields should all be pre-defined
      readOptionalFields
        ?.filter(
          (field): field is HydratedIntegrationFieldExistent =>
            !isIntegrationFieldMapping(field) &&
            "fieldName" in field &&
            "displayName" in field,
        )
        .map((field) => ({
          id: field.fieldName,
          label: field.displayName,
          isChecked: !!selectedOptionalFields?.[field.fieldName],
        }))
        .sort((a, b) => a.label.localeCompare(b.label)) || [],
    [readOptionalFields, selectedOptionalFields],
  );

  const shouldRender = !!(readOptionalFields && readOptionalFields.length > 0);
  const isAllChecked = checkboxItems.every(
    (item) => selectedOptionalFields?.[item.id] === true,
  );
  const isIndeterminate =
    !isAllChecked && Object.keys(selectedOptionalFields || {}).length > 0;

  return (
    shouldRender && (
      <>
        <FieldHeader
          string={`${appName} reads the following optional fields`}
        />
        <CheckboxPagination
          items={checkboxItems}
          onItemChange={onCheckboxChange}
          onSelectAllChange={onSelectAllCheckboxChange}
          isAllChecked={isAllChecked}
          isIndeterminate={isIndeterminate}
          showSelectAll={checkboxItems.length >= 2}
        />
      </>
    )
  );
}
