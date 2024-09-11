import {
  createContext, useContext, useState,
} from 'react';
import {
  Box, Container, Divider, Tabs, Text,
} from '@chakra-ui/react';

import { useInstallIntegrationProps } from 'context/InstallIntegrationContextProvider';
import { useProject } from 'context/ProjectContextProvider';
import { AmpersandFooter } from 'src/components/Oauth/OauthCardLayout/AmpersandFooter';
import { getProviderName } from 'src/utils';

import { useObjectsConfigureState } from '../../state/ConfigurationStateProvider';
import { useHydratedRevision } from '../../state/HydratedRevisionContext';
import { NavObject } from '../../types';
import { generateOtherNavObject, generateReadNavObjects } from '../../utils';

import { NavObjectItem } from './NavObjectItem';
import { OtherTab } from './OtherTab';
import { UNINSTALL_INSTALLATION_CONST, UninstallInstallation } from './UninstallInstallation';

// Create a context for the selected navObject's name
export const SelectedObjectNameContext = createContext<string | null | undefined>(null);

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
  }

  // uninstall tab
  return { name: UNINSTALL_INSTALLATION_CONST, completed: false };
}

// note: when the object key exists in the config; the user has already completed the object before
export function ObjectManagementNav({
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

  const allNavObjects = [...(readNavObjects || [])];
  if (otherNavObject && isWriteSupported) { allNavObjects.push(otherNavObject); }
  const selectedObject = getSelectedObject(allNavObjects, tabIndex);

  return (
    <SelectedObjectNameContext.Provider value={selectedObject?.name}>
      <Container maxWidth="55rem">
        <Box
          p={8}
          borderRadius={4}
          margin="auto"
          display="flex"
          gap="6"
          minHeight="100%"
          fontSize="md"
          backgroundColor="#FCFCFC"
          border="1px solid #EFEFEF"
          boxShadow="0px 4px 8px rgba(0, 0, 0, 0.05)"
        >
          <Box width="20rem">
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
                  <Divider marginTop={10} marginBottom={3} />
                  <UninstallInstallation
                    key="uninstall-installation"
                    text="Uninstall"
                  />
                </>

              )}
            </Tabs>
            )}
          </Box>
          {children}
        </Box>
        <AmpersandFooter />
      </Container>
    </SelectedObjectNameContext.Provider>
  );
}
