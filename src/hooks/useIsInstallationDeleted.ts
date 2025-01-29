import { useCallback, useEffect, useState } from 'react';

import { InstallIntegrationProps } from 'src/components/Configure/InstallIntegration';

// custom hook to check if the integration is deleted
// deleted integration triggers a terminal state in the InstallIntegrationApp
// resets install delete state when the InstallIntegration props change
export const useIsInstallationDeleted = (props: InstallIntegrationProps) => {
  const [isIntegrationDeleted, setIsIntegrationDeleted] = useState<boolean>(false);

  const setIntegrationDeleted = useCallback(() => {
    setIsIntegrationDeleted(true);
  }, [setIsIntegrationDeleted]);

  const installIntegrationProps = JSON.stringify(props); // Deep equality check

  // reset the state when the InstallIntegration props change
  useEffect(() => {
    setIsIntegrationDeleted(false);
  }, [setIsIntegrationDeleted, installIntegrationProps]);

  return { isIntegrationDeleted, setIntegrationDeleted };
};
