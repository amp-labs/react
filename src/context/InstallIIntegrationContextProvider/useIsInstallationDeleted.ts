import { useCallback, useState } from "react";

// custom hook to check if the integration is deleted
// deleted integration triggers a terminal state in the InstallIntegrationApp
export const useIsInstallationDeleted = () => {
  const [isIntegrationDeleted, setIsIntegrationDeleted] =
    useState<boolean>(false);

  const setIntegrationDeleted = useCallback(() => {
    setIsIntegrationDeleted(true);
  }, [setIsIntegrationDeleted]);

  const resetIntegrationDeleted = useCallback(() => {
    setIsIntegrationDeleted(false);
  }, [setIsIntegrationDeleted]);

  return {
    isIntegrationDeleted,
    setIntegrationDeleted,
    resetIntegrationDeleted,
  };
};
