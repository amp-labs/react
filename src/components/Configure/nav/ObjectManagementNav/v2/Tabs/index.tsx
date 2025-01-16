import * as Tabs from '@radix-ui/react-tabs';
import classnames from 'classnames';

import { NavIcon } from 'assets/NavIcon';
import { TrashIcon } from 'assets/TrashIcon';
import { NavObject, ObjectConfigurationsState } from 'src/components/Configure/types';
import { Divider } from 'src/components/ui-base/Divider';

import { UNINSTALL_INSTALLATION_CONST, WRITE_CONST } from '../../constant';

import styles from './tabs.module.css';

type NavObjectItemProps = {
  objectName: string;
  completed: boolean;
  pending: boolean;
  displayName?: string;
};

function NavObjectTab({
  objectName, completed, pending, displayName,
}: NavObjectItemProps) {
  return (
    <Tabs.Trigger value={objectName} className={styles.tabTrigger}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '.5rem', marginRight: '.5rem',
      }}
      >
        {NavIcon(completed, pending)}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>{displayName || objectName}</span>
          {pending && <span style={{ fontSize: '.8rem', fontStyle: 'italic' }}>pending</span>}
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

function WriteTab({
  completed, pending, displayName,
}: WriteTabProps) {
  return (
    <>
      <Divider style={{ margin: '1rem 0' }} />
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

function UninstallTab() {
  return (
    <>
      <Divider style={{ margin: '3rem 0 1rem 0' }} />
      <Tabs.Trigger
        value={UNINSTALL_INSTALLATION_CONST}
        className={classnames(styles.tabTrigger, styles.danger)}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: '.5rem', marginRight: '.5rem',
        }}
        >
          {TrashIcon()}
          <span>Uninstall</span>
        </div>
      </Tabs.Trigger>
    </>
  );
}

type VerticalTabsProps = {
  readNavObjects: NavObject[];
  writeNavObject?: NavObject;
  value: string;
  onValueChange: (value: string) => void;
  objectConfigurationsState?: ObjectConfigurationsState;
  showUninstallButton?: boolean;
};

export function VerticalTabs({
  value, readNavObjects, onValueChange, objectConfigurationsState,
  writeNavObject, showUninstallButton,
}: VerticalTabsProps) {
  return (
    <Tabs.Root value={value} className={styles.tabsRoot} onValueChange={onValueChange}>
      <Tabs.List className={styles.tabsList}>
        {/* Read tabs */}
        {readNavObjects.map((object) => (
          <NavObjectTab
            key={object.name}
            objectName={object.name}
            displayName={object.displayName}
            completed={object.completed}
            pending={objectConfigurationsState?.[object.name]?.read?.isOptionalFieldsModified
              || objectConfigurationsState?.[object.name]?.read?.isRequiredMapFieldsModified
              || objectConfigurationsState?.[object.name]?.read?.isValueMappingsModified || false}
          />
        ))}
        {/* Other / Write Tab */}
        {writeNavObject && (
          <WriteTab
            completed={writeNavObject.completed}
            pending={objectConfigurationsState?.other?.write?.isWriteModified || false}
            displayName="Write"
          />
        )}

        {/* Uninstall Tab */}
        {showUninstallButton && <UninstallTab />}
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
