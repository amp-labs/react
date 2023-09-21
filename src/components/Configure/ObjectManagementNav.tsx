import { createContext, useContext, useState } from 'react';
import { Box, Tab, Tabs } from '@chakra-ui/react';

import { useHydratedRevision } from '../../context/HydratedRevisionContext';
import { Config, HydratedRevision } from '../../services/api';

import { getActionTypeFromActions, getReadObject, PLACEHOLDER_VARS } from './utils';

type NavObjectItemProps = {
  objectName: string;
  completed: boolean;
};

// TODO: add a checkmark icon if the object is completed
function NavObjectItem({ objectName, completed }: NavObjectItemProps) {
  return (
    <Tab>{`${objectName}: ${completed}`}</Tab>
  );
}

export type NavObject = {
  name: string;
  completed: boolean;
};

function generateNavObjects(config: Config, hydratedRevision: HydratedRevision) {
  const { actions } = hydratedRevision.content;
  const action = getActionTypeFromActions(actions, PLACEHOLDER_VARS.OPERATION_TYPE);
  const navObjects: NavObject[] = [];
  action?.standardObjects?.forEach((object) => {
    navObjects.push(
      {
        name: object?.objectName,
        // object is completed if the key exists in the config
        completed: !!getReadObject(config, object.objectName),
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
  config: Config;
  children?: React.ReactNode;
};

function getSelectedObject(navObjects: NavObject[], tabIndex: number): NavObject | undefined {
  return navObjects?.[tabIndex];
}

// note: when the object key exists in the config; the user has already completed the object before
export function ObjectManagementNav({
  config,
  children,
}: ObjectManagementNavProps) {
  const { hydratedRevision, loading, error } = useHydratedRevision();
  const navObjects = hydratedRevision && generateNavObjects(config, hydratedRevision);
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabsChange = (index: number) => { setTabIndex(index); };
  const selectedObject = getSelectedObject(navObjects || [], tabIndex);

  return (
    <SelectedObjectNameContext.Provider value={selectedObject?.name}>
      <Box
        p={8}
        maxWidth="800px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        textAlign={['left']}
        margin="auto"
        marginTop="40px"
        bgColor="white"
        display="flex"
      >
        <Box marginTop="40px" paddingRight="10px">
          {error && <p>Error</p>}
          {loading && <p>Loading...</p>}
          {navObjects && (
          <Tabs
            index={tabIndex}
            onChange={handleTabsChange}
            orientation="horizontal"
            variant="solid-rounded"
            colorScheme="blue"
          >
            {navObjects.map((object) => (
              <NavObjectItem
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
