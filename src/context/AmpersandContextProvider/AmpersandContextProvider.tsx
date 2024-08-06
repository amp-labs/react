/**
 * AmpersandProvider.tsx
 *
 * Takes API key and project ID. Fetches source, making it available to all child components.
 * Also optionally accepts theme styles object with CSS values.
 */

import React, { createContext, useContext } from 'react';

import { ThemeProvider } from 'components/ThemeProvider';

import { ApiKeyProvider } from '../ApiKeyContextProvider';
import { ErrorStateProvider } from '../ErrorContextProvider';
import { IntegrationListProvider } from '../IntegrationListContextProvider';
import { ProjectProvider } from '../ProjectContextProvider';

interface AmpersandProviderProps {
  options: {
    apiKey: string,
    /**
     * Use `project` instead of `projectId`. 
     * @deprecated
     */
    projectId?: string,
    /**
     * `project` is the project ID or name.
     */
    project?: string,
    styles?: object,
  },
  children: React.ReactNode
}

export function AmpersandProvider(props: AmpersandProviderProps) {
  const { options: { apiKey, projectId, project }, children } = props;
  const projectIdOrName = project || projectId;
  if (projectId && project) {
    throw new Error(`Use AmpersandProvider either with projectId or project but not both.`);
  }
  if (!projectIdOrName) {
    throw new Error(`Cannot use AmpersandProvider without a projectId or name.`);
  }

  if(!apiKey) {
    throw new Error(`Cannot use AmpersandProvider without an apiKey.`);
  }

  return (
    <ThemeProvider>
      <ErrorStateProvider>
        <ApiKeyProvider value={apiKey}>
          <ProjectProvider projectIdOrName={projectIdOrName}>
            <IntegrationListProvider projectIdOrName={projectIdOrName}>
              {children}
            </IntegrationListProvider>
          </ProjectProvider>
        </ApiKeyProvider>
      </ErrorStateProvider>
    </ThemeProvider>
  );
}

export const AmpersandContext = createContext(null);
export function useAmpersandProvider() {
  const ampersandContext = useContext(AmpersandContext);

  if (!ampersandContext) {
    throw new Error(`Cannot call useAmpersandProvider unless your 
        component is wrapped with AmpersandProvider`);
  }

  return ampersandContext;
}
