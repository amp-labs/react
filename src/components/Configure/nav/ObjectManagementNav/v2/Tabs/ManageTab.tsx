import * as Tabs from '@radix-ui/react-tabs';

import { SettingGearIcon } from 'assets/SettingGearIcon';
import { Divider } from 'src/components/ui-base/Divider';

import { MANAGE_TAB_CONST } from '../../constant';

import styles from './tabs.module.css';

export function ManageTab() {
  return (
    <>
      <Divider style={{ margin: '1rem 0' }} />
      <Tabs.Trigger value={MANAGE_TAB_CONST} className={styles.tabTrigger}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '.5rem', marginRight: '.5rem',
        }}
        >
          <SettingGearIcon />
          <span>Manage</span>
        </div>
      </Tabs.Trigger>
    </>
  );
}
