import {
  createContext,
  useContext, useEffect, useMemo, useState,
} from 'react';

import { LoadingIcon } from '../assets/LoadingIcon';
import { ErrorTextBox } from '../components/Configure/ErrorTextBox';
import { api, Project } from '../services/api';

import { ApiKeyContext } from './ApiKeyContext';
import {
  ErrorBoundary, useErrorState,
} from './ErrorContextProvider';

interface ProjectContextValue {
  project: Project | null;
  appName: string;
  projectId: string;
}

export const ProjectContext = createContext<ProjectContextValue>({
  project: null,
  appName: '',
  projectId: '',
});

export const useProject = (): ProjectContextValue => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }

  return context;
};

type ProjectProviderProps = {
  projectId: string,
  children?: React.ReactNode;
};

export function ProjectProvider(
  { projectId, children }: ProjectProviderProps,
) {
  const [project, setProject] = useState<Project | null>(null);
  const apiKey = useContext(ApiKeyContext);
  const [isLoading, setLoadingState] = useState<boolean>(true);
  const { isError, setError } = useErrorState();

  useEffect(() => {
    api().getProject({ projectId }, {
      headers: {
        'X-Api-Key': apiKey ?? '',
      },
    }).then((_project) => {
      setLoadingState(false);
      setProject(_project);
    }).catch((err) => {
      setError(ErrorBoundary.PROJECT, projectId);
      setLoadingState(false);
      console.error('Error loading Ampersand project: ', err);
    });
  }, [projectId, apiKey, setLoadingState, setError]);

  const contextValue = useMemo(() => ({
    projectId, project, appName: project?.appName || '',
  }), [projectId, project]);

  return (
    isError(ErrorBoundary.PROJECT, projectId)
      ? <ErrorTextBox message={`Error loading project ${projectId}`} />
      : (
        <ProjectContext.Provider value={contextValue}>
          {isLoading ? <LoadingIcon /> : children}
        </ProjectContext.Provider>
      )
  );
}
