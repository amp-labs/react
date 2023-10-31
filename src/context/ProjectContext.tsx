import {
  createContext,
  useContext, useEffect, useMemo, useState,
} from 'react';

import { LoadingIcon } from '../assets/LoadingIcon';
import { ErrorTextBox } from '../components/Configure/ErrorTextBox';
import { api, Project } from '../services/api';

import { ApiKeyContext } from './ApiKeyContext';
import {
  ErrorBoundary, isError, setError, useErrorState,
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
  const { errorState, setErrorState } = useErrorState();

  useEffect(() => {
    api().getProject({ projectId }, {
      headers: {
        'X-Api-Key': apiKey ?? '',
      },
    }).then((_project) => {
      setLoadingState(false);
      setProject(_project);
    }).catch((err) => {
      setError(ErrorBoundary.PROJECT_ERROR_BOUNDARY, projectId, setErrorState);
      setLoadingState(false);
      console.error('ERROR: ', err);
    });
  }, [projectId, apiKey, setLoadingState, setErrorState]);

  const contextValue = useMemo(() => ({
    projectId, project, appName: project?.appName || '',
  }), [projectId, project]);

  return (
    isError(ErrorBoundary.PROJECT_ERROR_BOUNDARY, projectId, errorState)
      ? <ErrorTextBox message={`Error loading project ${projectId}`} />
      : (
        <ProjectContext.Provider value={contextValue}>
          {isLoading ? <LoadingIcon /> : children}
        </ProjectContext.Provider>
      )
  );
}
