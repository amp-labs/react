/**
 * AmpersandProvider.tsx
 *
 * Takes API key and project ID. Fetches source, making it available to all child components.
 * Also optionally accepts theme styles object with CSS values.
 */

import React, {
  createContext, useContext, useMemo, useState,
} from 'react';

import { ProviderConnectionProvider } from '../../context/ProviderConnectionContext';
import { SourceListProvider } from '../../context/SourceListContext';
import { SubdomainContextConfig } from '../../types/configTypes';

interface AmpersandProviderProps {
  options: {
    apiKey: string,
    projectID: string,
    styles?: object,
  },
  children: React.ReactNode
}

export const SubdomainContext = createContext<SubdomainContextConfig>({
  subdomain: '',
  setSubdomain: () => null,
});
export const ProjectIDContext = createContext<string | null>(null);
export const ApiKeyContext = createContext<string | null>(null);

export function AmpersandProvider(props: AmpersandProviderProps) {
  const [subdomain, setSubdomain] = useState('');

  const { options: { apiKey, projectID }, children } = props;

  // INIT SUBDOMAIN CONTEXT
  const subdomainContext = useMemo(() => ({
    subdomain,
    setSubdomain,
  }), [subdomain]);

  return (
    <ProviderConnectionProvider>
      <SourceListProvider projectID={projectID} apiKey={apiKey}>
        <SubdomainContext.Provider value={subdomainContext}>
          <ProjectIDContext.Provider value={projectID}>
            <ApiKeyContext.Provider value={apiKey}>
              { children }
            </ApiKeyContext.Provider>
          </ProjectIDContext.Provider>
        </SubdomainContext.Provider>
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
