import {
  createContext, useContext, useEffect,
  useMemo, useState,
} from 'react';

import { getIntegrations } from '../services/apiService';
import { SourceList } from '../types/configTypes';

interface SourceListContextValue {
  sources: SourceList | null;
}

export const SourceListContext = createContext<SourceListContextValue>({
  sources: null,
});

export const useSourceList = (): SourceListContextValue => {
  const context = useContext(SourceListContext);

  if (!context) {
    throw new Error('useSourceList must be used within a SourceListProvider');
  }

  return context;
};

type SourceListContextProviderProps = {
  projectID: string,
  apiKey: string,
  children?: React.ReactNode;
};

export function SourceListProvider(
  { projectID, apiKey, children }: SourceListContextProviderProps,
) {
  const [sources, setSources] = useState<SourceList | null>(null);

  useEffect(() => {
    // todo replace with integrations sdk call
    getIntegrations(projectID, apiKey)
      .then((res) => {
        setSources(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [projectID, apiKey]);

  const contextValue = useMemo(() => ({
    sources,
  }), [sources]);

  return (
    <SourceListContext.Provider value={contextValue}>
      {children}
    </SourceListContext.Provider>
  );
}
