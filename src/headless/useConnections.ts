import { useConnectionsListQuery } from 'hooks/query/useConnectionsListQuery';
import { useIntegrationQuery } from 'hooks/query/useIntegrationQuery';

import { useInstallationProps } from './InstallationProvider';

/**
 * Connection manager that gives a connection if one is available.
 * Loading and error states are also returned.
 */
export const useConnection = () => {
  const { groupRef, integrationId } = useInstallationProps();
  const { provider } = useIntegrationQuery(integrationId);

  const query = useConnectionsListQuery({ groupRef, provider });

  const {
    isPending, // The query has no data yet
    isFetching, //  In any state, if the query is fetching at any time (including background refetching)
    isError, // The query encountered an error
    isSuccess, // The query was successful and data is available
    error, // If the query is in an isError state, the error is available via the error property.
    data: connections, // If the query is in an isSuccess state, the data is available via the data property.
  } = query;

  const connection = connections?.[0]; // a single connection if any

  return {
    connection, // first connection in connections array
    error,
    isPending,
    isFetching,
    isError,
    isSuccess,
  };
};
