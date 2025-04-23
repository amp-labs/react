import { useQuery } from '@tanstack/react-query';
import { useProject } from 'context/ProjectContextProvider';
import { useAPI } from 'services/api';

export const useListProviderAppsQuery = () => {
  const getAPI = useAPI();
  const { projectIdOrName } = useProject();

  return useQuery({
    queryKey: ['amp', 'providerApps', projectIdOrName],
    queryFn: async () => {
      if (!projectIdOrName) throw new Error('Project ID is required');
      const api = await getAPI();
      return api.providerAppApi.listProviderApps({ projectIdOrName });
    },
    enabled: !!projectIdOrName,
  });
};
