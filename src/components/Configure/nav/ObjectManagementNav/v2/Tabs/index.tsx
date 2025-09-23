import * as Tabs from "@radix-ui/react-tabs";
import { NavIcon } from "assets/NavIcon";
import {
  areWriteObjectsEqual,
  getServerFieldMappings,
  getServerOptionalSelectedFields,
} from "src/components/Configure/state/utils";
import {
  NavObject,
  ObjectConfigurationsState,
} from "src/components/Configure/types";
import {
  isFieldMappingsEqual,
  isOptionalFieldsEqual,
  isValueMappingsEqual,
} from "src/components/Configure/utils";
import { Divider } from "src/components/ui-base/Divider";
import { useInstallation } from "src/headless/installation/useInstallation";
import { useHydratedRevisionQuery } from "src/headless/manifest/useHydratedRevisionQuery";

import { WRITE_CONST } from "../../constant";

import { ManageTab } from "./ManageTab";

import styles from "./tabs.module.css";

type NavObjectItemProps = {
  objectName: string;
  completed: boolean;
  pending: boolean;
  displayName?: string;
};

function NavObjectTab({
  objectName,
  completed,
  pending,
  displayName,
}: NavObjectItemProps) {
  return (
    <Tabs.Trigger value={objectName} className={styles.tabTrigger}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: ".5rem",
          marginRight: ".5rem",
        }}
      >
        {NavIcon(completed, pending)}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>{displayName || objectName}</span>
          {pending && (
            <span style={{ fontSize: ".8rem", fontStyle: "italic" }}>
              pending
            </span>
          )}
        </div>
      </div>
    </Tabs.Trigger>
  );
}

type WriteTabProps = {
  completed: boolean;
  pending: boolean;
  displayName: string;
};

function WriteTab({ completed, pending, displayName }: WriteTabProps) {
  return (
    <>
      <Divider style={{ margin: "1rem 0" }} />
      <NavObjectTab
        key="other-write"
        objectName={WRITE_CONST}
        completed={completed}
        pending={pending}
        displayName={displayName}
      />
    </>
  );
}

type VerticalTabsProps = {
  readNavObjects: NavObject[];
  writeNavObject?: NavObject;
  value: string;
  onValueChange: (value: string) => void;
  objectConfigurationsState?: ObjectConfigurationsState;
};

export function VerticalTabs({
  value,
  readNavObjects,
  onValueChange,
  objectConfigurationsState,
  writeNavObject,
}: VerticalTabsProps) {
  const { data: hydratedRevision } = useHydratedRevisionQuery();
  const { installation } = useInstallation();
  const serverConfig = installation?.config; // from server

  const serverWriteObjects = serverConfig?.content?.write?.objects;
  const selectedWriteObjects =
    objectConfigurationsState?.other?.write?.selectedWriteObjects;

  return (
    <Tabs.Root
      value={value}
      className={styles.tabsRoot}
      onValueChange={onValueChange}
    >
      <Tabs.List className={styles.tabsList}>
        {/* Read tabs */}
        {readNavObjects.map((object) => {
          const serverReadConfig =
            serverConfig?.content?.read?.objects?.[object.name];
          const configureState = objectConfigurationsState?.[object.name]; // local state

          // field mappings derived state (captures both required and optional map fields)
          const serverFieldMappings = getServerFieldMappings(
            serverConfig,
            object.name,
          );
          const selectedFieldMappings =
            configureState?.read?.selectedFieldMappings;

          const isFieldMappingsModified = !isFieldMappingsEqual(
            serverFieldMappings,
            selectedFieldMappings,
          );

          // server optional fields
          const serverOptionalFields = hydratedRevision
            ? getServerOptionalSelectedFields(
                serverConfig,
                hydratedRevision,
                object.name,
              )
            : undefined;
          const selectedOptionalFields =
            configureState?.read?.selectedOptionalFields;

          const isOptionalFieldsModified = !isOptionalFieldsEqual(
            serverOptionalFields,
            selectedOptionalFields,
          );

          // derived state for value mappings modified
          // is modified derived state
          const savedValueMappings = serverReadConfig?.selectedValueMappings;
          const selectedValueMappings =
            configureState?.read?.selectedValueMappings;

          // check if value mappings (local) is equal to saved value mappings (server)
          const isValueMappingsModified = !isValueMappingsEqual(
            savedValueMappings,
            selectedValueMappings,
          );

          const isPending =
            isOptionalFieldsModified ||
            isFieldMappingsModified ||
            isValueMappingsModified ||
            false;

          return (
            <NavObjectTab
              key={object.name}
              objectName={object.name}
              displayName={object.displayName}
              completed={object.completed}
              pending={isPending}
            />
          );
        })}
        {/* Other / Write Tab */}
        {writeNavObject &&
          (() => {
            const isWriteModified = !areWriteObjectsEqual(
              serverWriteObjects || {},
              selectedWriteObjects || {},
            );

            return (
              <WriteTab
                completed={writeNavObject.completed}
                pending={isWriteModified}
                displayName="Write"
              />
            );
          })()}

        {/* Manage Tab */}
        <ManageTab />
      </Tabs.List>

      {/* EXAMPLE Content if children does not render content */}
      {/* <Tabs.Content value="tab1" className={styles.tabContent}>
        <p>Content for Tab 1</p>
      </Tabs.Content>
      <Tabs.Content value="tab2" className={styles.tabContent}>
        <p>Content for Tab 2</p>
      </Tabs.Content>
      <Tabs.Content value="tab3" className={styles.tabContent}>
        <p>Content for Tab 3</p>
      </Tabs.Content> */}
    </Tabs.Root>
  );
}
