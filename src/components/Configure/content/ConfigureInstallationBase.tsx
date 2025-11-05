import { FormEventHandler } from "react";
import { Button } from "src/components/ui-base/Button";
import { useInstallation } from "src/headless/installation/useInstallation";

import { FormErrorBox } from "components/FormErrorBox";
import { LoadingCentered } from "components/Loading";
import { Box } from "components/ui-base/Box/Box";

import {
  MANAGE_TAB_CONST,
  WRITE_CONST,
} from "../nav/ObjectManagementNav/constant";
import { useHydratedRevision } from "../state/HydratedRevisionContext";
import {
  areWriteObjectsEqual,
  getServerFieldMappings,
  getServerOptionalSelectedFields,
} from "../state/utils";
import {
  getReadObject,
  isFieldMappingsEqual,
  isOptionalFieldsEqual,
  isValueMappingsEqual,
} from "../utils";

import { ReadFields } from "./fields/ReadFields";
import { WriteFields } from "./fields/WriteObjects";
import { ManageContent } from "./manage/ManageContent";
import { useSelectedConfigureState } from "./useSelectedConfigureState";
interface ConfigureInstallationBaseProps {
  isCreateMode?: boolean;
  onSave: FormEventHandler;
  onReset: () => void;
  isLoading: boolean;
  errorMsg?: string | boolean | string[];
}

// Installation UI Base
export function ConfigureInstallationBase({
  onSave,
  onReset,
  isLoading,
  isCreateMode = false,
  errorMsg,
}: ConfigureInstallationBaseProps) {
  const { installation } = useInstallation();
  const { hydratedRevision, loading } = useHydratedRevision();
  const { configureState, selectedObjectName } = useSelectedConfigureState();

  // check if selected object is completed.
  const config = installation?.config;
  const isSelectedReadConfigComplete =
    (config &&
      selectedObjectName &&
      !!getReadObject(config, selectedObjectName)) ||
    false;

  // field mappings ///////////////
  // fetched from server
  const serverFieldMappings = selectedObjectName
    ? getServerFieldMappings(config, selectedObjectName)
    : undefined;
  const selectedFieldMappings = configureState?.read?.selectedFieldMappings;

  // is modified derived state (captures both required and optional map fields)
  const isFieldMappingsModified = !isFieldMappingsEqual(
    serverFieldMappings,
    selectedFieldMappings,
  );

  // optional fields ///////////////
  // fetched from server
  const serverOptionalFields =
    hydratedRevision && selectedObjectName
      ? getServerOptionalSelectedFields(
          config,
          hydratedRevision,
          selectedObjectName,
        )
      : undefined;
  const selectedOptionalFields = configureState?.read?.selectedOptionalFields;

  // is modified derived state
  const isOptionalFieldsModified = !isOptionalFieldsEqual(
    serverOptionalFields,
    selectedOptionalFields,
  );

  // value mappings ///////////////
  // fetched from server
  const serverValueMappings = selectedObjectName
    ? config?.content?.read?.objects?.[selectedObjectName]
        ?.selectedValueMappings
    : undefined;

  // is modified derived state
  const selectedValueMappings = configureState?.read?.selectedValueMappings;

  // check if value mappings (local) is equal to saved value mappings (server)
  const isValueMappingsModified = !isValueMappingsEqual(
    serverValueMappings,
    selectedValueMappings,
  );

  // write objects ///////////////
  // fetched from server
  const serverWriteObjects = config?.content?.write?.objects;
  const selectedWriteObjects = configureState?.write?.selectedWriteObjects;

  // is modified derived state
  const isWriteModified = !areWriteObjectsEqual(
    serverWriteObjects || {},
    selectedWriteObjects || {},
  );

  // has the form been modified?
  const isReadModified =
    isOptionalFieldsModified ||
    isFieldMappingsModified ||
    isValueMappingsModified;
  const isModified = isReadModified || isWriteModified;

  // if the read object is not completed, it is a new state
  const isSelectedReadObjectComplete =
    selectedObjectName !== WRITE_CONST && !isSelectedReadConfigComplete;
  // is this a new state (modified or creating a new state)
  const isStateNew = isModified || isCreateMode || isSelectedReadObjectComplete;

  // if the selected read object has an error in the manifest, it should not be saved
  const isSelectedReadObjectError =
    !!hydratedRevision?.content?.read?.objects?.find(
      (obj) => obj.objectName === selectedObjectName,
    )?.error;

  // should the save button be disabled?
  const isDisabled =
    loading ||
    isLoading ||
    !configureState ||
    !selectedObjectName ||
    !isStateNew ||
    isSelectedReadObjectError;

  // is write selected?
  const isNonConfigurableWrite = selectedObjectName === WRITE_CONST;

  // is the manage tab selected?
  const isManageTabSelected = selectedObjectName === MANAGE_TAB_CONST;

  const ButtonBridgeSubmit = (
    <Button type="submit" disabled={isDisabled}>
      {isCreateMode ? "Install" : "Save"}
    </Button>
  );
  const ButtonBridgeReset = (
    <Button
      type="button"
      onClick={onReset}
      disabled={isDisabled}
      variant="ghost"
    >
      Reset
    </Button>
  );

  return isLoading ? (
    <LoadingCentered />
  ) : (
    <form style={{ width: "34rem" }} onSubmit={onSave}>
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          gap: ".8rem",
          marginBottom: "20px",
          height: "3rem",
        }}
      >
        {!isManageTabSelected && (
          <>
            {ButtonBridgeSubmit}
            {ButtonBridgeReset}
          </>
        )}
      </div>
      <Box
        style={{
          padding: "1rem 2rem",
          minHeight: "300px",
          backgroundColor: "var(--amp-colors-bg-primary)",
          borderColor: "var(--amp-colors-border)",
        }}
      >
        {errorMsg && (
          <FormErrorBox>
            {typeof errorMsg === "string" ? errorMsg : "Installation Failed."}
          </FormErrorBox>
        )}
        {loading && <LoadingCentered />}
        {hydratedRevision &&
          !isNonConfigurableWrite &&
          !isManageTabSelected && <ReadFields />}
        {hydratedRevision && isNonConfigurableWrite && !isManageTabSelected && (
          <WriteFields />
        )}
        {!loading && isManageTabSelected && <ManageContent />}
      </Box>
    </form>
  );
}
