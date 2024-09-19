import {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';

import { ErrorTextBox } from 'components/ErrorTextBox/ErrorTextBox';
import { api, Project } from 'services/api';
import { LoadingCentered } from 'src/components/Loading';

import { useApiKey } from './ApiKeyContextProvider';
import {
  ErrorBoundary, useErrorState,
} from './ErrorContextProvider';

interface ProjectContextValue {
  project: Project | null;
  appName: string;
  projectId: string;
  projectIdOrName: string;
}

export const ProjectContext = createContext<ProjectContextValue>({
  project: null,
  appName: '',
  projectId: '',
  projectIdOrName: '',
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
      setError(ErrorBoundary.PROJECT, projectIdOrName);
      setLoadingState(false);
      console.error('Error loading Ampersand project: ', err);
    });
  }, [projectIdOrName, apiKey, setLoadingState, setError]);

  const contextValue = useMemo(() => ({
    projectId: project?.id || '', projectIdOrName, project, appName: project?.appName || '',
  }), [projectIdOrName, project]);

  return (
    isError(ErrorBoundary.PROJECT, projectIdOrName)
      ? <ErrorTextBox message={`Error loading project ${projectIdOrName}`} />
      : (
        <ProjectContext.Provider value={contextValue}>
          {isLoading ? <LoadingCentered /> : children}
        </ProjectContext.Provider>
      )
  );
}
