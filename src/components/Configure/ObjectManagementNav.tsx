import {
  createContext, forwardRef, useContext, useState,
} from 'react';
import {
  Box, Button, Tabs, Text,
  useMultiStyleConfig, useTab,
} from '@chakra-ui/react';

import { useHydratedRevision } from '../../context/HydratedRevisionContext';
import { useInstallIntegrationProps } from '../../context/InstallIntegrationContext';
import { useProject } from '../../context/ProjectContext';
import { Config, HydratedRevision } from '../../services/api';

import { getActionTypeFromActions, getReadObject, PLACEHOLDER_VARS } from './utils';

interface NavObjectItemProps {
  objectName: string;
  completed: boolean;
}

const CustomTab = forwardRef<HTMLButtonElement, NavObjectItemProps>(
  ({ objectName, completed }, ref) => {
    // 1. Reuse the `useTab` hook
    const tabProps = useTab({ ref });

    // 2. Hook into the Tabs `size`, `variant`, props
    const styles = useMultiStyleConfig('Tabs', tabProps);

    return (
      <Button __css={styles.tab} {...tabProps}>
        <Box as="span" mr="3">
          {completed ? '✅' : '⚪'} {objectName}
        </Box>
        {tabProps.children}
      </Button>
    );
  },
);

export type NavObject = {
  name: string;
  completed: boolean;
};

function generateNavObjects(config: Config | undefined, hydratedRevision: HydratedRevision) {
  const { actions } = hydratedRevision.content;
  const action = getActionTypeFromActions(actions, PLACEHOLDER_VARS.OPERATION_TYPE);
  const navObjects: NavObject[] = [];
  action?.standardObjects?.forEach((object) => {
    navObjects.push(
      {
        name: object?.objectName,
        // if no config, object is not completed
        // object is completed if the key exists in the config
        completed: config ? !!getReadObject(config, object.objectName) : false,
      },
    );
  });

  return navObjects;
}

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
  const { hydratedRevision, loading, error } = useHydratedRevision();
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
        borderRadius="8px"
        boxShadow="md"
        textAlign={['left']}
        margin="auto"
        bgColor="whitesmoke"
        display="flex"
        minHeight="100%"
      >
        <Box minWidth="12rem">
          <Text>Salesforce integration</Text>
          <Text marginBottom="20px" fontSize="1.125rem" fontWeight="500">{appName}</Text>
          {error && <p>Error</p>}
          {loading && <p>Loading...</p>}
          {navObjects && (
          <Tabs
            index={tabIndex}
            onChange={handleTabsChange}
            orientation="horizontal"
          >
            {navObjects.map((object) => (
              <CustomTab
                key={object.name}
                objectName={object.name}
                completed={object.completed}
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
