import {
  useCallback, useEffect, useMemo, useState,
} from 'react';

import { Box } from 'components/ui-base/Box/Box';
import { Container } from 'components/ui-base/Container/Container';
import { useInstallIntegrationProps } from 'context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import { VerticalTabs } from 'src/components/Configure/nav/ObjectManagementNav/v2/Tabs';
import { NavObject } from 'src/components/Configure/types';
import { useProvider } from 'src/hooks/useProvider';
import { AmpersandFooter } from 'src/layout/AuthCardLayout/AmpersandFooter';

import { useObjectsConfigureState } from '../../../state/ConfigurationStateProvider';
import { useHydratedRevision } from '../../../state/HydratedRevisionContext';
import { generateReadNavObjects, generateWriteNavObject } from '../../../utils';
import { UNINSTALL_INSTALLATION_CONST } from '../constant';
import { NextTabIndexContext, SelectedObjectNameContext } from '../ObjectManagementNavContext';

function getSelectedObject(navObjects: NavObject[], tabValue: string): NavObject | undefined {
  if (tabValue === UNINSTALL_INSTALLATION_CONST) {
    // uninstall tab
    return { name: UNINSTALL_INSTALLATION_CONST, completed: false };
  }

  // read or write tabs
  return navObjects.find((navObj) => navObj.name === tabValue);
}

  type ObjectManagementNavProps = {
    children?: React.ReactNode;
  };

// note: when the object key exists in the config; the user has already completed the object before
export function ObjectManagementNavV2({
  children,
}: ObjectManagementNavProps) {
  const { project } = useProject();
  const { installation } = useInstallIntegrationProps();
  const { providerName } = useProvider();
  const { hydratedRevision } = useHydratedRevision();
  const { objectConfigurationsState } = useObjectsConfigureState();

  // Object Nav Tab Value
  const [tabValue, setTabvalue] = useState('');

  const appName = project?.appName || '';
  const config = installation?.config;
  const readNavObjects = hydratedRevision && generateReadNavObjects(config, hydratedRevision);
  const isNavObjectsReady = readNavObjects !== null; // null = hydratedRevision/config is not ready

  const isWriteSupported = !!hydratedRevision?.content?.write;
  const writeNavObject = isWriteSupported ? generateWriteNavObject(config) : undefined;

  const allNavObjects = useMemo(() => {
    const navObjects = [...(readNavObjects || [])];
    if (writeNavObject && isWriteSupported) { navObjects.push(writeNavObject); }
    return navObjects;
  }, [readNavObjects, writeNavObject, isWriteSupported]);

  const selectedObject = getSelectedObject(allNavObjects, tabValue);

  /**
   * Function to navigate to the first uncompleted tab or do nothing if all tabs are completed
   *  */
  const onNextIncompleteTab = useCallback(() => {
    const nextIncompleteNavObj = allNavObjects.find((navObj) => selectedObject !== navObj && !navObj.completed);
    if (nextIncompleteNavObj) {
      setTabvalue(nextIncompleteNavObj.name);
    }
  }, [allNavObjects, selectedObject]);

  useEffect(() => {
    if (!tabValue && allNavObjects.length > 0) {
      setTabvalue(allNavObjects[0].name);
    }
  }, [allNavObjects, tabValue, onNextIncompleteTab]);

  return (
    <NextTabIndexContext.Provider value={onNextIncompleteTab}>
      <SelectedObjectNameContext.Provider value={selectedObject?.name}>
        {/* Install integration component container */}
        <Container style={{ maxWidth: '55rem' }}>
          <Box
            style={{
              display: 'flex',
              gap: '1rem',
              padding: '3rem',
              backgroundColor: 'var(--amp-colors-bg-primary)',
            }}
          >
            <div style={{ width: '20rem' }}>
              <h1 style={{ fontSize: 'small', fontWeight: '400' }}>{providerName} integration
              </h1>
              <h3 style={{ marginBottom: '20px', fontSize: 'large', fontWeight: '500' }}>{appName}
              </h3>

              {isNavObjectsReady && (
              // dummy mock tabs with styling only
              <VerticalTabs
                value={tabValue}
                readNavObjects={readNavObjects}
                onValueChange={(value: string) => setTabvalue(value)}
                objectConfigurationsState={objectConfigurationsState}
                writeNavObject={writeNavObject}
                showUninstallButton={!!installation}
              />
              )}
            </div>
            {children}
          </Box>
          <AmpersandFooter />
        </Container>
      </SelectedObjectNameContext.Provider>
    </NextTabIndexContext.Provider>
  );
}
