import {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';

import { api, Project } from '../services/api';

import { ApiKeyContext } from './ApiKeyContext';

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
  { projectId, children }:ProjectProviderProps,
) {
  const [project, setProject] = useState<Project | null>(null);
  const apiKey = useContext(ApiKeyContext);

  useEffect(() => {
    api().getProject({ projectId }, {
      headers: {
        'X-Api-Key': apiKey ?? '',
      },
    }).then((_project) => {
      setProject(_project);
    }).catch((err) => {
      console.error('ERROR: ', err);
    });
  }, [projectId, apiKey]);

  const contextValue = useMemo(() => ({
    projectId, project, appName: project?.appName || '',
  }), [projectId, project]);

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
}
