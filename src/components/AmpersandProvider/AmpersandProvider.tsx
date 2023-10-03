/**
 * AmpersandProvider.tsx
 *
 * Takes API key and project ID. Fetches source, making it available to all child components.
 * Also optionally accepts theme styles object with CSS values.
 */

import React, { createContext, useContext } from 'react';

import { ApiKeyProvider } from '../../context/ApiKeyContext';
import { IntegrationListProvider } from '../../context/IntegrationListContext';
import { ProjectProvider } from '../../context/ProjectContext';
import { SubdomainProvider } from '../../context/SubdomainProvider';

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
    <ApiKeyProvider value={apiKey}>
      <IntegrationListProvider projectId={projectId}>
        <SubdomainProvider>
          <ProjectProvider projectId={projectId}>
            { children }
          </ProjectProvider>
        </SubdomainProvider>
      </IntegrationListProvider>
    </ApiKeyProvider>
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
