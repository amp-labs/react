import { useListInstallationsQuery } from "src/hooks/query";

import { useInstallationProps } from "../InstallationProvider";

export function useInstallation() {
  // Extracting integrationNameOrId and groupRef from useInstallationProps.
  // These are required for the useListInstallationsQuery, especially in headless mode,
  // where the integration and group context must be explicitly provided.
  const { integrationNameOrId, groupRef } = useInstallationProps();
  const installationsQuery = useListInstallationsQuery(
    integrationNameOrId,
    groupRef,
  );
  const {
    isPending, // The query has no data yet
    isFetching, //  In any state, if the query is fetching at any time (including background refetching)
    isError, // The query encountered an error
    isSuccess, // The query was successful and data is available
    error, // If the query is in an isError state, the error is available via the error property.
    data: installations, // If the query is in an isSuccess state, the data is available via the data property.
  } = installationsQuery;

  const installation = installations?.[0];

  return {
    installation,
    isPending,
    isFetching,
    isError,
    isSuccess,
    error,
  };
}
