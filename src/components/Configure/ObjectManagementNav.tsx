import {
  Box,
  Tab,
  Tabs,
} from '@chakra-ui/react';

import { useHydratedRevision } from '../../context/HydratedRevisionContext';
import { Config, HydratedRevision } from '../../services/api';

import { getActionTypeFromActions, PLACEHOLDER_VARS } from './utils';

type NavObjectItemProps = {
  objectName: string;
  completed: boolean;
};

function NavObjectItem({ objectName, completed }: NavObjectItemProps) {
  return (
    <Tab>{`${objectName}: ${completed}`}</Tab>
  );
}

export type NavObjects = {
  name: string;
  completed: boolean;
};

function generateNavObjects(config: Config, hydratedRevision: HydratedRevision) {
  const { actions } = hydratedRevision.content;
  const action = getActionTypeFromActions(actions, PLACEHOLDER_VARS.OPERATION_TYPE);
  const navObjects: NavObjects[] = [];
  action?.standardObjects?.forEach((object) => {
    navObjects.push(
      {
        name: object?.objectName,
        completed: !!config?.content?.read?.objects?.[object.objectName],
      },
    );
  });

  return navObjects;
}

type ObjectManagementNavProps = {
  config: Config;
  children?: React.ReactNode;
};

// note: when the object key exists in the config; the user has already completed the object before

export function ObjectManagementNav({
  config,
  children,
}: ObjectManagementNavProps) {
  const { hydratedRevision, loading, error } = useHydratedRevision();
  const navObjects = hydratedRevision && generateNavObjects(config, hydratedRevision);

  return (
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
          orientation="horizontal"
          variant="solid-rounded"
          colorScheme="blue"
        >
          {navObjects.map((object) => (
            <NavObjectItem objectName={object.name} completed={object.completed} />))}
        </Tabs>
        )}
      </Box>
      {children}
    </Box>
  );
}
