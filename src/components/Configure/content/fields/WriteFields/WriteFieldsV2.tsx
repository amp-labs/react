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

  const shouldRender = !!writeObjects;

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
          showSelectAll={writeObjects.length >= 2}
          searchPlaceholder="Search objects..."
          itemName="objects"
        />
      </>
    )
  );
}
