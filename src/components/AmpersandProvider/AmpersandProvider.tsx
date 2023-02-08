/**
 * AmpersandProvider.tsx
 *
 * Takes API key and project ID. Fetches source, making it available to all child components.
 * Also optionally accepts theme styles object with CSS values.
 */

import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { SourceList } from '../types/configTypes';

interface AmpersandProviderProps {
  options: {
    apiKey: string,
    projectID: string,
    styles?: object,
  },
  children: React.ReactNode
}

/**
 * Compose source URL from params.
 *
 * @param apiKey {string} Builder's API key.
 * @param projectId {string} Builder's project ID
 * @returns {string} URL to be called to fetch source.
 */
const getAllSourcesURL = (apiKey: string, projectId: string) : string => {
  console.log(apiKey); /* eslint-disable-line no-console */
  console.log(projectId); /* eslint-disable-line no-console */

  return 'https://us-central1-ampersand-demo-server.cloudfunctions.net/getAllSources';
};

export const AmpersandContext = createContext<SourceList | null>(null);

export function AmpersandProvider(props: AmpersandProviderProps) {
  const [sources, setSources] = useState(null);
  const { options, children } = props;
  const { apiKey, projectID } = options;

  axios.get(getAllSourcesURL(apiKey, projectID))
    .then((res) => {
      setSources(res.data);
    });

  return (
    <AmpersandContext.Provider value={sources}>
      { children }
    </AmpersandContext.Provider>
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
