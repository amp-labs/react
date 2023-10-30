import {
  createContext, useContext, useState,
} from 'react';
import { Box, Tabs, Text } from '@chakra-ui/react';

import { useHydratedRevision } from '../../../context/HydratedRevisionContext';
import { useInstallIntegrationProps } from '../../../context/InstallIntegrationContext';
import { useProject } from '../../../context/ProjectContext';
import { useConfigureState } from '../state/ConfigurationStateProvider';
import { NavObject } from '../types';
import { generateNavObjects } from '../utils';

import { NavObjectItem } from './NavObjectItem';

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
  return navObjects?.[tabIndex];
}

// note: when the object key exists in the config; the user has already completed the object before
export function ObjectManagementNav({
  children,
}: ObjectManagementNavProps) {
  const { installation } = useInstallIntegrationProps();
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
        maxWidth="1024px"
        border="1px solid #EFEFEF"
        borderRadius={6}
        boxShadow="md"
        textAlign={['left']}
        margin="auto"
        bgColor="whitesmoke"
        display="flex"
        minHeight="100%"
      >
        <Box minWidth="12rem" paddingRight={6}>
          <Text>Salesforce integration</Text>
          <Text marginBottom="20px" fontSize="1.125rem" fontWeight="500">{appName}</Text>
          {navObjects && (
            <Tabs
              index={tabIndex}
              onChange={handleTabsChange}
              orientation="horizontal"
            >
              {navObjects.map((object) => (
                <NavObjectItem
                  key={object.name}
                  objectName={object.name}
                  completed={object.completed}
                  pending={objectConfigurationsState[object.name]?.modified}
                />
              ))}
            </Tabs>
          )}
        </Box>
        {children}
      </Box>
    </SelectedObjectNameContext.Provider>
  );
}
