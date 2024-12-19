import {
  createContext, useContext, useEffect, useMemo,
} from 'react';
import useSWR from 'swr';

import { Project, useAPI } from 'services/api';
import { handleServerError } from 'src/utils/handleServerError';

import {
  ErrorBoundary, useErrorState,
} from './ErrorContextProvider';

function useProjectSWR(projectIdOrName: string) {
  const getAPI = useAPI();

  async function fetchProjectData(): Promise<Project> {
    const api = await getAPI();
    const response = api.projectApi.getProject({ projectIdOrName })
      .then((_project) => _project);

    return response;
  }

  const { data, error } = useSWR(
    projectIdOrName ? `/api/projects/${projectIdOrName}` : null,
    fetchProjectData,
  );

  if (error) handleServerError(error);

  return {
    project: data,
    isLoading: !error && !data,
    isError: error,
  };
}

interface ProjectContextValue {
  project: Project | null;
  appName: string;
  projectId: string;
  projectIdOrName: string;
  isLoading: boolean;
}

export const ProjectContext = createContext<ProjectContextValue>({
  project: null,
  appName: '',
  projectId: '',
  projectIdOrName: '',
  isLoading: true,
});

export const useProject = (): ProjectContextValue => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }

  return context;
};

type ProjectProviderProps = {
  projectIdOrName: string,
  children?: React.ReactNode;
};

export function ProjectProvider(
  { projectIdOrName, children }: ProjectProviderProps,
) {
  const { setError } = useErrorState();
  const { project, isLoading, isError } = useProjectSWR(projectIdOrName);

  // set global error state if project fetch fails
  useEffect(() => {
    if (isError) setError(ErrorBoundary.PROJECT, projectIdOrName);
  }, [isError, setError, projectIdOrName]);

  const contextValue = useMemo(() => ({
    projectId: project?.id || '',
    projectIdOrName,
    project: project || null,
    appName: project?.appName || '',
    isLoading,
  }), [projectIdOrName, project, isLoading]);

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
}
