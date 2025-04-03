// headless installation provider

import {
  createContext,
  useContext,
  useMemo,
} from 'react';

// Define the context value type
interface InstallationContextValue {
  integrationName: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
}
// Create a context to pass down the props
const InstallationContext = createContext<InstallationContextValue>({
  integrationName: '',
  consumerRef: '',
  consumerName: undefined,
  groupRef: '',
  groupName: undefined,
});

// Create a custom hook to access the props
export function useInstallationProps() {
  const context = useContext(InstallationContext);
  if (!context) {
    throw new Error('useInstallationProps must be used within an InstallationProvider');
  }
  return context;
}

interface InstallationProviderProps {
  integrationName: string;
  consumerRef: string,
  consumerName?: string,
  groupRef: string,
  groupName?: string,
  children: React.ReactNode,
}

// Wrap your parent component with the context provider
export function InstallationProvider({
  children, integrationName, consumerRef, consumerName, groupRef, groupName,
}: InstallationProviderProps) {
  const props = useMemo(() => ({
    integrationName,
    consumerRef,
    consumerName,
    groupRef,
    groupName,
  }), [integrationName, consumerRef, consumerName, groupRef, groupName]);

  return (
    <InstallationContext.Provider value={props}>
      {children}
    </InstallationContext.Provider>
  );
}
