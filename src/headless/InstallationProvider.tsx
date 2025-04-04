// headless installation provider

import {
  createContext,
  useContext,
  useMemo,
} from 'react';

// Define the context value type
interface InstallationContextValue {
  integrationNameOrId: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
}
// Create a context to pass down the props
const InstallationContext = createContext<InstallationContextValue>({
  integrationNameOrId: '',
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
  integration: string; // integration name or id
  consumerRef: string,
  consumerName?: string,
  groupRef: string,
  groupName?: string,
  children: React.ReactNode,
}

// Wrap your parent component with the context provider
export function InstallationProvider({
  children, integration, consumerRef, consumerName, groupRef, groupName,
}: InstallationProviderProps) {
  const props = useMemo(() => ({
    integrationNameOrId: integration,
    consumerRef,
    consumerName,
    groupRef,
    groupName,
  }), [integration, consumerRef, consumerName, groupRef, groupName]);

  return (
    <InstallationContext.Provider value={props}>
      {children}
    </InstallationContext.Provider>
  );
}
