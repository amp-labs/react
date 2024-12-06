import {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';

import { ErrorTextBox } from 'components/ErrorTextBox/ErrorTextBox';
import { api, Project } from 'services/api';
import { handleServerError } from 'src/utils/handleServerError';

import { useApiKey } from './ApiKeyContextProvider';
import {
  ErrorBoundary, useErrorState,
} from './ErrorContextProvider';

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
  const apiKey = useApiKey();
  const { isError, setError } = useErrorState();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setLoadingState] = useState<boolean>(true);

  useEffect(() => {
    api().projectApi.getProject({ projectIdOrName }, {
      headers: {
        'X-Api-Key': apiKey ?? '',
      },
    }).then((_project) => {
      setLoadingState(false);
      setProject(_project);
    }).catch((err) => {
      console.error('Error loading Ampersand project.');
      handleServerError(err);
      setError(ErrorBoundary.PROJECT, projectIdOrName);
      setLoadingState(false);
    });
  }, [projectIdOrName, apiKey, setLoadingState, setError]);

  const contextValue = useMemo(() => ({
    projectId: project?.id || '',
    projectIdOrName,
    project,
    appName: project?.appName || '',
    isLoading,
  }), [projectIdOrName, project, isLoading]);

  return (
    isError(ErrorBoundary.PROJECT, projectIdOrName)
      ? <ErrorTextBox message={`Error loading project ${projectIdOrName}`} />
      : (
        <ProjectContext.Provider value={contextValue}>
          {children}
        </ProjectContext.Provider>
      )
  );
}
