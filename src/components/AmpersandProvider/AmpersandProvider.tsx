/**
 * AmpersandProvider.tsx
 *
 * Takes API key and project ID. Fetches source, making it available to all child components.
 * Also optionally accepts theme styles object with CSS values.
 */

import { createContext, useContext } from 'react';
import TestSalesforceIntegrationSource from '../../testData/integrationSource';
import { IntegrationSource, ObjectConfigOptions } from '../types/configTypes';

interface AmpersandProviderProps {
  options: {
    apiKey: string,
    projectID: string,
    styles?: object,
  },
  children: React.ReactNode
}

/**
 * Call out to get integration source.
 * Currently just mocks the API call.
 *
 * @param apiKey {string} API key for Ampersand backend.
 * @param projectId {string} Builder's project ID.
 * @returns source {IntegrationSource} Integration source.
 */
function getSource(apiKey: string, projectId: string): IntegrationSource {
  console.log(apiKey); /* eslint-disable-line no-console */
  console.log(projectId); /* eslint-disable-line no-console */

  // JUST MOCK THE API CALL FOR NOW, IMPORT SOURCE FROM LOCAL FILE
  const source = TestSalesforceIntegrationSource;

  return source;
}

export const AmpersandContext = createContext<IntegrationSource | null>(null);

export function AmpersandProvider(props: AmpersandProviderProps) {
  const { options, children } = props;

  const source = getSource(options.apiKey, options.projectID);

  return (
    <AmpersandContext.Provider value={source}>
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
