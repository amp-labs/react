import {
  useCallback, useMemo, useState,
} from 'react';
import {
  Tabs, Text,
} from '@chakra-ui/react';

import { Box } from 'components/ui-base/Box/Box';
import { Container } from 'components/ui-base/Container/Container';
import { Divider } from 'components/ui-base/Divider';
import { useInstallIntegrationProps } from 'context/InstallIntegrationContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import { AmpersandFooter } from 'src/layout/AuthCardLayout/AmpersandFooter';
import { getProviderName } from 'src/utils';

import { useObjectsConfigureState } from '../../state/ConfigurationStateProvider';
import { useHydratedRevision } from '../../state/HydratedRevisionContext';
import { NavObject } from '../../types';
import { generateOtherNavObject, generateReadNavObjects } from '../../utils';

import { NavObjectItem } from './NavObjectItem';
import { NextTabIndexContext, SelectedObjectNameContext } from './ObjectManagementNavContext';
import { OtherTab } from './OtherTab';
import { UNINSTALL_INSTALLATION_CONST, UninstallInstallation } from './UninstallInstallation';

type ObjectManagementNavProps = {
  children?: React.ReactNode;
};

function getSelectedObject(navObjects: NavObject[], tabIndex: number): NavObject | undefined {
  if (navObjects?.[tabIndex]) {
    // read tabs
    return navObjects[tabIndex];
  }

  // uninstall tab
  return { name: UNINSTALL_INSTALLATION_CONST, completed: false };
}

const backgroundColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--amp-colors-background-secondary').trim() || '#FCFCFC';

/**
 * @deprecated remove this component when the chakra migration is done
 * @param param0
 * @returns
 */
// note: when the object key exists in the config; the user has already completed the object before
export function ChakraObjectManagementNav({
  children,
}: ObjectManagementNavProps) {
  const { project } = useProject();
  const { installation, provider } = useInstallIntegrationProps();
  const { hydratedRevision } = useHydratedRevision();
  const { objectConfigurationsState } = useObjectsConfigureState();

  // Object Nav Tab Index
  const [tabIndex, setTabIndex] = useState(0);

  const appName = project?.appName || '';
  const config = installation?.config;
  const readNavObjects = hydratedRevision && generateReadNavObjects(config, hydratedRevision);
  const isNavObjectsReady = readNavObjects !== null; // null = hydratedRevision/config is not ready

  const isWriteSupported = !!hydratedRevision?.content?.write;
  const otherNavObject = isWriteSupported ? generateOtherNavObject(config) : undefined;

  const allNavObjects = useMemo(() => {
    const navObjects = [...(readNavObjects || [])];
    if (otherNavObject && isWriteSupported) { navObjects.push(otherNavObject); }
    return navObjects;
  }, [readNavObjects, otherNavObject, isWriteSupported]);
  const selectedObject = getSelectedObject(allNavObjects, tabIndex);

  /**
   * Function to navigate to the first uncompleted tab or do nothing if all tabs are completed
   *  */
  const onNextIncompleteTab = useCallback(() => {
    const nextIncompleteNavObj = allNavObjects.find((navObj) => selectedObject !== navObj && !navObj.completed);
    if (nextIncompleteNavObj) {
      setTabIndex(allNavObjects.indexOf(nextIncompleteNavObj));
    }
  }, [allNavObjects, selectedObject]);

  return (
    <NextTabIndexContext.Provider value={onNextIncompleteTab}>
      <SelectedObjectNameContext.Provider value={selectedObject?.name}>
        <Container style={{ maxWidth: '55rem' }}>
          <Box
            style={{
              display: 'flex',
              gap: '1rem',
              padding: '3rem',
              backgroundColor,
            }}
          >
            <div style={{ width: '20rem' }}>
              <Text>{getProviderName(provider)} integration</Text>
              <Text marginBottom="20px" fontSize="1.125rem" fontWeight="500">{appName}</Text>
              {isNavObjectsReady && (
              <Tabs
                index={tabIndex}
                onChange={setTabIndex}
                orientation="horizontal"
              >
                {/* Read tab */}
                {readNavObjects.map((object) => (
                  <NavObjectItem
                    key={object.name}
                    objectName={object.name}
                    completed={object.completed}
                    pending={
                    objectConfigurationsState[object.name]?.read?.isOptionalFieldsModified
                    || objectConfigurationsState[object.name]?.read?.isRequiredMapFieldsModified
                  }
                  />
                ))}

                {/* Other tab - write */}
                { isWriteSupported && otherNavObject && (
                <OtherTab
                  completed={otherNavObject.completed}
                  pending={objectConfigurationsState?.other?.write?.isWriteModified}
                  displayName={readNavObjects?.length ? 'other' : 'write'}
                />
                ) }

                {/* Uninstall tab */}
                {installation && (
                <>
                  <Divider style={{ margin: '3rem 0 1rem 0' }} />
                  <UninstallInstallation
                    key="uninstall-installation"
                    text="Uninstall"
                  />
                </>
                )}
              </Tabs>
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

export function ObjectManagementNav({ ...props }: ObjectManagementNavProps) {
  // TODO: native tabs still in progress
  // if (isChakraRemoved) {
  //   return <ObjectManagementNavV2 {...props} />;
  // }

  return <ChakraObjectManagementNav {...props} />;
}
