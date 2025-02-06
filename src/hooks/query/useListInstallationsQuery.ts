import { useQuery } from '@tanstack/react-query';

import { useProject } from 'context/ProjectContextProvider';
import { useAPI } from 'src/services/api';

export const useListInstallationsQuery = (integrationId?: string, groupRef?: string) => {
  const getAPI = useAPI();
  const { projectId } = useProject();

  return useQuery({
    queryKey: ['amp', 'installations', projectId, integrationId, groupRef],
    queryFn: async () => {
      if (!projectId) throw new Error('Project ID is required');
      if (!integrationId) throw new Error('Integration ID is required');
      if (!groupRef) throw new Error('Group reference is required');

      const api = await getAPI();
      return api.installationApi.listInstallations({
        projectIdOrName: projectId,
        integrationId,
        groupRef,
      });
    },
    enabled: !!projectId && !!integrationId && !!groupRef,
  });
};
