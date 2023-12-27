import {
  createContext, useContext, useState,
} from 'react';
import {
  Box, Divider, Tabs, Text,
} from '@chakra-ui/react';

import { useInstallIntegrationProps } from '../../../context/InstallIntegrationContext';
import { useProject } from '../../../context/ProjectContext';
import { capitalize } from '../../../utils';
import { useConfigureState } from '../state/ConfigurationStateProvider';
import { useHydratedRevision } from '../state/HydratedRevisionContext';
import { NavObject } from '../types';
import { generateNavObjects } from '../utils';

import { NavObjectItem } from './NavObjectItem';
import { OTHER_CONST, OtherTab } from './OtherTab';
import { UNINSTALL_INSTALLATION_CONST, UninstallInstallation } from './UninstallInstallation';

// Create a context for the selected navObject's name
const SelectedObjectNameContext = createContext<string | null | undefined>(null);

// Custom hook to access the selected navObject's name
export function useSelectedObjectName() {
  const selectedNavObjectName = useContext(SelectedObjectNameContext);
  if (selectedNavObjectName === null) {
    throw new Error(
      'useSelectedNavObjectName must be used within a SelectedNavObjectNameProvider',
    );
  }
  return { selectedObjectName: selectedNavObjectName }; // Return as an object
}

type ObjectManagementNavProps = {
  children?: React.ReactNode;
};

function getSelectedObject(navObjects: NavObject[], tabIndex: number): NavObject | undefined {
  if (navObjects?.[tabIndex]) {
    // read tabs
    return navObjects[tabIndex];
  } if (tabIndex === navObjects.length) {
    // other - non configurable write tab
    return { name: OTHER_CONST, completed: false };
  }
  if (tabIndex > navObjects.length - 1) {
    // uninstall tab
    return { name: UNINSTALL_INSTALLATION_CONST, completed: false };
  }
  return undefined;
}

// note: when the object key exists in the config; the user has already completed the object before
export function ObjectManagementNav({
  children,
}: ObjectManagementNavProps) {
  const { installation, provider } = useInstallIntegrationProps();
  const { hydratedRevision } = useHydratedRevision();
  const { objectConfigurationsState } = useConfigureState();
  const config = installation?.config;
  const navObjects = hydratedRevision && generateNavObjects(config, hydratedRevision);
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabsChange = (index: number) => { setTabIndex(index); };
  const selectedObject = getSelectedObject(navObjects || [], tabIndex);
  const { project } = useProject();
  const appName = project?.appName || '';

  return (
    <SelectedObjectNameContext.Provider value={selectedObject?.name}>
      <Box
        p={8}
        maxWidth="55rem"
        border="1px solid #EFEFEF"
        borderRadius={6}
        boxShadow="md"
        margin="auto"
        bgColor="whitesmoke"
        display="flex"
        gap="6"
        minHeight="100%"
      >
        <Box width="20rem">
          <Text>{capitalize(provider)} integration</Text>
          <Text marginBottom="20px" fontSize="1.125rem" fontWeight="500">{appName}</Text>
          {navObjects && (
            <Tabs
              index={tabIndex}
              onChange={handleTabsChange}
              orientation="horizontal"
            >
              {/* Read tab */}
              {navObjects.map((object) => (
                <NavObjectItem
                  key={object.name}
                  objectName={object.name}
                  completed={object.completed}
                  pending={
                    objectConfigurationsState[object.name]?.isOptionalFieldsModified
                    || objectConfigurationsState[object.name]?.isRequiredMapFieldsModified
                  }
                />
              ))}

              {/* Other tab - write */}
              <OtherTab />

              {/* Uninstall tab */}
              {installation && (
                <>
                  <Divider marginTop={10} marginBottom={3} />
                  <UninstallInstallation
                    key="uninstall-intallation"
                    text="Uninstall"
                  />
                </>

              )}
            </Tabs>
          )}
        </Box>
        {children}
      </Box>
    </SelectedObjectNameContext.Provider>
  );
}
