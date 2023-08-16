/**
 * AmpersandProvider.tsx
 *
 * Takes API key and project ID. Fetches source, making it available to all child components.
 * Also optionally accepts theme styles object with CSS values.
 */

import React, {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';
import { getIntegrations } from 'services/apiService';
import {
  ProviderConnectionContextConfig,
  SourceList, SubdomainContextConfig,
} from 'types/configTypes';

interface AmpersandProviderProps {
  options: {
    apiKey: string,
    projectID: string,
    styles?: object,
  },
  children: React.ReactNode
}

export const AmpersandContext = createContext(null);
export const ProviderConnectionContext = createContext<ProviderConnectionContextConfig>({
  isConnectedToProvider: {},
  setIsConnectedToProvider: () => null,
});
export const ApiKeyContext = createContext<string | null>(null);
export const SourceListContext = createContext<SourceList | null>(null);
export const ProjectIDContext = createContext<string | null>(null);
export const SubdomainContext = createContext<SubdomainContextConfig>({
  subdomain: '',
  setSubdomain: () => null,
});

export function AmpersandProvider(props: AmpersandProviderProps) {
  const [sources, setSources] = useState<SourceList | null>(null);
  const [subdomain, setSubdomain] = useState('');
  const [isConnectedToProvider, setIsConnectedToProvider] = useState({});

  const { options, children } = props;
  const { apiKey, projectID } = options;

  // CALL FOR SOURCE LIST
  useEffect(() => {
    getIntegrations(projectID, apiKey)
      .then((res) => {
        setSources(res.data);
      })
      .catch((err) => {
        /* eslint-disable-next-line no-console */
        console.error(err);
      });
  }, [projectID, apiKey]);

  // INIT SUBDOMAIN CONTEXT
  const subdomainContext = useMemo(() => ({
    subdomain,
    setSubdomain,
  }), [subdomain]);

  // INIT PROVIDER CONNECTION CONTEXT
  const isConnectedToProviderContext = useMemo(() => ({
    isConnectedToProvider,
    setIsConnectedToProvider,
  }), [isConnectedToProvider]);

  return (
    <ProviderConnectionContext.Provider value={isConnectedToProviderContext}>
      <SourceListContext.Provider value={sources}>
        <SubdomainContext.Provider value={subdomainContext}>
          <ProjectIDContext.Provider value={options.projectID}>
            <ApiKeyContext.Provider value={options.apiKey}>
              { children }
            </ApiKeyContext.Provider>
          </ProjectIDContext.Provider>
        </SubdomainContext.Provider>
      </SourceListContext.Provider>
    </ProviderConnectionContext.Provider>
  );
}

export function useAmpersandProvider() {
  const ampersandContext = useContext(AmpersandContext);

  if (!ampersandContext) {
    throw new Error(`Cannot call useAmpersandProvider unless your 
        component is wrapped with AmpersandProvider`);
  }

  return ampersandContext;
}
