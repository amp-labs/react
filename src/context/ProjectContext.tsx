import {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';

import { api, Project } from '../services/api';

interface ProjectContextValue {
  project: Project | null;
  projectId: string | null;
}

export const ProjectContext = createContext<ProjectContextValue>({
  project: null,
  projectId: null,
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

  useEffect(() => {
    api.getProject({ projectId }).then((_project) => {
      setProject(_project);
    }).catch((err) => {
      console.error('ERROR: ', err);
    });
  }, [projectId]);

  const contextValue = useMemo(() => ({ projectId, project }), [projectId]);

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
}
