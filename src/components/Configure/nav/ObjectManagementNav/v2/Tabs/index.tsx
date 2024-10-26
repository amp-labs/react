import * as Tabs from '@radix-ui/react-tabs';

import { NavIcon } from 'assets/NavIcon';
import { NavObject, ObjectConfigurationsState } from 'src/components/Configure/types';

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

type VerticalTabsProps = {
  readNavObjects: NavObject[];
  value: string;
  onValueChange: (value: string) => void;
  objectConfigurationsState?: ObjectConfigurationsState;
};

export function VerticalTabs({
  value, readNavObjects, onValueChange, objectConfigurationsState,
}: VerticalTabsProps) {
  return (
    <Tabs.Root value={value} className={styles.tabsRoot} onValueChange={onValueChange}>
      <Tabs.List className={styles.tabsList}>
        {readNavObjects.map((object) => (
          <NavObjectTab
            key={object.name}
            objectName={object.name}
            completed={object.completed}
            pending={objectConfigurationsState?.[object.name]?.read?.isOptionalFieldsModified
              || objectConfigurationsState?.[object.name]?.read?.isRequiredMapFieldsModified || false}
          />
        ))}
        {/* Other Tab */}
        {/* TODO */}

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
