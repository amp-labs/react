import { createContext, useContext, useEffect, useMemo } from "react";
import { Project } from "services/api";

import { useProjectQuery } from "../hooks/query";

import { ErrorBoundary, useErrorState } from "./ErrorContextProvider";

interface ProjectContextValue {
  project: Project | null;
  appName: string;
  projectId: string;
  projectIdOrName: string;
  isLoading: boolean;
}

export const ProjectContext = createContext<ProjectContextValue>({
  project: null,
  appName: "",
  projectId: "",
  projectIdOrName: "",
  isLoading: true,
});

export const useProject = (): ProjectContextValue => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }

  return context;
};

type ProjectProviderProps = {
  projectIdOrName: string;
  children?: React.ReactNode;
};

export function ProjectProvider({
  projectIdOrName,
  children,
}: ProjectProviderProps) {
  const { setError } = useErrorState();
  const { data: project, isLoading, isError } = useProjectQuery();

  useEffect(() => {
    if (isError) setError(ErrorBoundary.PROJECT, projectIdOrName);
  }, [isError, projectIdOrName, setError]);

  const contextValue = useMemo(
    () => ({
      projectId: project?.id || "",
      projectIdOrName,
      project: project || null,
      appName: project?.appName || "",
      isLoading,
    }),
    [projectIdOrName, project, isLoading],
  );

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
}
