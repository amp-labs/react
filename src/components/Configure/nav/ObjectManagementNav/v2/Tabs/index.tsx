import * as Tabs from '@radix-ui/react-tabs';

import { NavIcon } from 'assets/NavIcon';
import { NavObject, ObjectConfigurationsState } from 'src/components/Configure/types';
import { Divider } from 'src/components/ui-base/Divider';

import { OTHER_CONST } from '../../constant';

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

type OtherTabProps = {
  completed: boolean;
  pending: boolean;
  displayName: string;
};

function OtherTab({
  completed, pending, displayName,
}: OtherTabProps) {
  return (
    <>
      <Divider style={{ margin: '1rem 0' }} />
      <NavObjectTab
        key="other-write"
        objectName={OTHER_CONST}
        completed={completed}
        pending={pending}
        displayName={displayName}
      />
    </>
  );
}

type VerticalTabsProps = {
  readNavObjects: NavObject[];
  otherNavObject?: NavObject; // write tab
  value: string;
  onValueChange: (value: string) => void;
  objectConfigurationsState?: ObjectConfigurationsState;
};

export function VerticalTabs({
  value, readNavObjects, onValueChange, objectConfigurationsState,
  otherNavObject,
}: VerticalTabsProps) {
  return (
    <Tabs.Root value={value} className={styles.tabsRoot} onValueChange={onValueChange}>
      <Tabs.List className={styles.tabsList}>
        {/* Read tabs */}
        {readNavObjects.map((object) => (
          <NavObjectTab
            key={object.name}
            objectName={object.name}
            completed={object.completed}
            pending={objectConfigurationsState?.[object.name]?.read?.isOptionalFieldsModified
              || objectConfigurationsState?.[object.name]?.read?.isRequiredMapFieldsModified || false}
          />
        ))}
        {/* Other / Write Tab */}
        {otherNavObject && (
          <OtherTab
            completed={otherNavObject.completed}
            pending={objectConfigurationsState?.other?.write?.isWriteModified || false}
             // if read tab exists, display 'other' else 'write' when write tab is the only tab
            displayName={readNavObjects.length ? 'other' : 'write'}
          />
        )}

        {/* Uninstall Tab */}
        {/* <Tabs.Trigger value="uninstall" className={styles.tabTrigger} style={{}}>Uninstall</Tabs.Trigger> */}
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
