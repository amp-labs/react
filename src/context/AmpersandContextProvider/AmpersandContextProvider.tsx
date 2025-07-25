/**
 * AmpersandProvider.tsx
 *
 * Takes API key and project ID. Fetches source, making it available to all child components.
 * Also optionally accepts theme styles object with CSS values.
 */

import React, { createContext, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ApiKeyProvider } from "../ApiKeyContextProvider";
import { ErrorStateProvider } from "../ErrorContextProvider";

interface AmpersandProviderProps {
  options: {
    apiKey: string;
    /**
     * Use `project` instead of `projectId`.
     * @deprecated
     */
    projectId?: string;
    /**
     * `project` is the project ID or name.
     */
    project?: string;
    styles?: object;
  };
  children: React.ReactNode;
}

interface AmpersandContextValue {
  options: AmpersandProviderProps["options"];
  projectIdOrName: string;
}

export const AmpersandContext = createContext<AmpersandContextValue | null>(
  null,
);

export function useAmpersandProviderProps(): AmpersandContextValue {
  const ampersandContext = useContext(AmpersandContext);

  if (!ampersandContext) {
    throw new Error(`Cannot call useAmpersandProvider unless your 
        component is wrapped with AmpersandProvider`);
  }

  return ampersandContext;
}

const queryClient = new QueryClient();

export function AmpersandProvider(props: AmpersandProviderProps) {
  const {
    options: { apiKey, projectId, project },
    children,
  } = props;
  const projectIdOrName = project || projectId;
  if (projectId && project) {
    throw new Error(
      "Use AmpersandProvider either with projectId or project but not both.",
    );
  }
  if (!projectIdOrName) {
    throw new Error(
      "Cannot use AmpersandProvider without a projectId or name.",
    );
  }

  if (!apiKey) {
    throw new Error("Cannot use AmpersandProvider without an apiKey.");
  }

  const contextValue: AmpersandContextValue = {
    options: props.options,
    projectIdOrName,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AmpersandContext.Provider value={contextValue}>
        <ErrorStateProvider>
          <ApiKeyProvider value={apiKey}>{children}</ApiKeyProvider>
        </ErrorStateProvider>
      </AmpersandContext.Provider>
    </QueryClientProvider>
  );
}
