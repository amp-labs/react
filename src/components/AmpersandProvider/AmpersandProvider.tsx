/**
 * AmpersandProvider.tsx
 *
 * Takes API key and project ID. Fetches source, making it available to all child components.
 * Also optionally accepts theme styles object with CSS values.
 */

import {
  createContext, useContext, useEffect, useState, useMemo,
} from 'react';
import {
  ProviderConnectionContextConfig,
  SourceList, SubdomainContextConfig,
} from '../types/configTypes';
import { getAllSources } from '../../library/services/apiService';

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
  isAuthenticatedToProvider: {
    salesforce: null,
  },
  setIsAuthenticatedToProvider: null, // eslint-disable-line
});
export const SourceListContext = createContext<SourceList | null>(null);
export const ProjectIDContext = createContext<string | null>(null);
export const SubdomainContext = createContext<SubdomainContextConfig>({
  subdomain: '',
  setSubdomain: () => {}, // eslint-disable-line
});

export function AmpersandProvider(props: AmpersandProviderProps) {
  const [sources, setSources] = useState(null);
  const [subdomain, setSubdomain] = useState(null);
  const [isAuthenticatedToProvider, setIsAuthenticatedToProvider] = useState({
    salesforce: null,
  });

  const { options, children } = props;
  const { apiKey, projectID } = options;

  // CALL FOR SOURCE LIST
  useEffect(() => {
    getAllSources(apiKey, projectID)
      .then((res) => {
        setSources(res.data);
      })
      .catch((err) => {
        /* eslint-disable-next-line no-console */
        console.error(err);
      });
  }, [apiKey, projectID]);

  const subdomainContext = useMemo(() => ({
    subdomain,
    setSubdomain,
  }), [subdomain]);

  const isAuthenticatedToProviderContext = useMemo(() => ({
    isAuthenticatedToProvider,
    setIsAuthenticatedToProvider,
  }), [isAuthenticatedToProvider]);

  return (
    <ProviderConnectionContext.Provider value={isAuthenticatedToProviderContext}>
      <SourceListContext.Provider value={sources}>
        <SubdomainContext.Provider value={subdomainContext}>
          <ProjectIDContext.Provider value={options.projectID}>
            { children }
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
