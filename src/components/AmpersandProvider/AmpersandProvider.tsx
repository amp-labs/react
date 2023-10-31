/**
 * AmpersandProvider.tsx
 *
 * Takes API key and project ID. Fetches source, making it available to all child components.
 * Also optionally accepts theme styles object with CSS values.
 */

import React, { createContext, useContext } from 'react';

import { ApiKeyProvider } from '../../context/ApiKeyContext';
import { ErrorStateProvider } from '../../context/ErrorContextProvider';
import { IntegrationListProvider } from '../../context/IntegrationListContext';
import { ProjectProvider } from '../../context/ProjectContext';
import { ThemeProvider } from '../ThemeProvider';

interface AmpersandProviderProps {
  options: {
    apiKey: string,
    projectId: string,
    styles?: object,
  },
  children: React.ReactNode
}

export function AmpersandProvider(props: AmpersandProviderProps) {
  const { options: { apiKey, projectId }, children } = props;
  return (
    <ThemeProvider>
      <ErrorStateProvider>
        <ApiKeyProvider value={apiKey}>
          <ProjectProvider projectId={projectId}>
            <IntegrationListProvider projectId={projectId}>
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
