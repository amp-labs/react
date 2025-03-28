import { useQuery } from '@tanstack/react-query';

import { useProject } from 'src/context/ProjectContextProvider';
import { useAPI } from 'src/services/api';

type ConnectionsListQueryProps = {
  groupRef?: string;
  provider?: string;
};

export const useConnectionsListQuery = ({ groupRef, provider }: ConnectionsListQueryProps) => {
  const { projectIdOrName } = useProject();

  const getAPI = useAPI();
  return useQuery({
    queryKey: ['amp', 'connections', projectIdOrName, groupRef, provider],
    queryFn: async () => {
      if (!projectIdOrName) {
        throw new Error('Project ID or name not found. Please wrap this component inside of AmpersandProvider');
      }
      if (!groupRef) throw new Error('Group reference not found.');
      if (!provider) throw new Error('Provider not found.');

      const api = await getAPI();
      return api.connectionApi.listConnections({ projectIdOrName, groupRef, provider });
    },
    retry: 3, // retry 3 times before showing error
    enabled: !!projectIdOrName && !!groupRef && !!provider,
  });
};
