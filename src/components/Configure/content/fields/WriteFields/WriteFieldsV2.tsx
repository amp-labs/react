import {
  type CheckboxItem,
  CheckboxPagination,
} from "components/ui-base/Checkbox/CheckboxPagination";

import { useSelectedConfigureState } from "../../useSelectedConfigureState";
import { FieldHeader } from "../FieldHeader";

import { setNonConfigurableWriteField } from "./setNonConfigurableWriteField";

export function WriteFieldsV2() {
  const { appName, selectedObjectName, configureState, setConfigureState } =
    useSelectedConfigureState();
  const selectedWriteFields = configureState?.write?.selectedWriteObjects;
  const writeObjects = configureState?.write?.writeObjects;

  const onItemChange = (id: string, checked: boolean) => {
    if (selectedObjectName && configureState) {
      setNonConfigurableWriteField(
        selectedObjectName,
        setConfigureState,
        id,
        checked,
      );
    }
  };

  const onSelectAllChange = (checked: boolean) => {
    if (selectedObjectName && configureState) {
      configureState?.write?.writeObjects?.forEach((field) => {
        setNonConfigurableWriteField(
          selectedObjectName,
          setConfigureState,
          field.objectName,
          checked,
        );
      });
    }
  };

  const shouldRender = !!writeObjects;
  const isAllChecked =
    Object.keys(selectedWriteFields || {}).length ===
    configureState?.write?.writeObjects?.length;
  const isIndeterminate =
    !isAllChecked && Object.keys(selectedWriteFields || {}).length > 0;

  const checkboxItems: CheckboxItem[] =
    writeObjects?.map((field) => ({
      id: field.objectName,
      label: field.displayName,
      isChecked: !!selectedWriteFields?.[field.objectName],
    })) || [];

  return (
    shouldRender && (
      <>
        <FieldHeader string={`Allow ${appName} to write to these objects`} />
        <CheckboxPagination
          items={checkboxItems}
          onItemChange={onItemChange}
          onSelectAllChange={onSelectAllChange}
          isAllChecked={isAllChecked}
          isIndeterminate={isIndeterminate}
          showSelectAll={writeObjects.length >= 2}
        />
      </>
    )
  );
}
