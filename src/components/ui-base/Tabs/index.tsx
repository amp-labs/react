import * as Tabs from '@radix-ui/react-tabs';

import { NavIcon } from 'assets/NavIcon';

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

export function VerticalTabs() {
  return (
    <Tabs.Root defaultValue="tab1" className={styles.tabsRoot}>
      <Tabs.List className={styles.tabsList}>
        <NavObjectTab objectName="tab1" completed={false} pending={false} displayName="Tab 1" />
        <NavObjectTab objectName="tab2" completed pending={false} displayName="Tab 2" />
        <NavObjectTab objectName="tab3" completed={false} pending displayName="Tab 3" />
        {/* <Tabs.Trigger value="uninstall" className={styles.tabTrigger} style={{}}>Uninstall</Tabs.Trigger> */}
      </Tabs.List>

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
