import {
  type CheckboxItem,
  CheckboxPagination,
} from "components/ui-base/Checkbox/CheckboxPagination";

import { useSelectedConfigureState } from "../../useSelectedConfigureState";
import { FieldHeader } from "../FieldHeader";

import { setNonConfigurableWriteObject } from "./setNonConfigurableWriteField";

export function WriteObjectsV2() {
  const { appName, selectedObjectName, configureState, setConfigureState } =
    useSelectedConfigureState();
  const selectedWriteObjects = configureState?.write?.selectedWriteObjects;
  const writeObjects = configureState?.write?.writeObjects;

  const onItemChange = (id: string, checked: boolean) => {
    if (selectedObjectName && configureState) {
      setNonConfigurableWriteObject(
        selectedObjectName,
        setConfigureState,
        id,
        checked,
      );
    }
  };

  const shouldRender = !!writeObjects;

  const checkboxItems: CheckboxItem[] =
    writeObjects?.map((obj) => ({
      id: obj.objectName,
      label: obj.displayName,
      isChecked: !!selectedWriteObjects?.[obj.objectName],
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
