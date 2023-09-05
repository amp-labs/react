/**
 * AmpersandProvider.tsx
 *
 * Takes API key and project ID. Fetches source, making it available to all child components.
 * Also optionally accepts theme styles object with CSS values.
 */

import React, { createContext, useContext } from 'react';

import { ProviderConnectionProvider } from '../../context/ProviderConnectionContext';
import { SourceListProvider } from '../../context/SourceListContext';
import { SubdomainProvider } from '../../context/SubdomainProvider';

interface AmpersandProviderProps {
  options: {
    apiKey: string,
    projectID: string,
    styles?: object,
  },
  children: React.ReactNode
}

export const ProjectIDContext = createContext<string | null>(null);
export const ApiKeyContext = createContext<string | null>(null);

export function AmpersandProvider(props: AmpersandProviderProps) {
  const { options: { apiKey, projectID }, children } = props;

  return (
    <ProviderConnectionProvider>
      <SourceListProvider projectID={projectID} apiKey={apiKey}>
        <SubdomainProvider>
          <ProjectIDContext.Provider value={projectID}>
            <ApiKeyContext.Provider value={apiKey}>
              { children }
            </ApiKeyContext.Provider>
          </ProjectIDContext.Provider>
        </SubdomainProvider>
      </SourceListProvider>
    </ProviderConnectionProvider>
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
