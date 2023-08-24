import React, {
  createContext, useContext, useMemo, useState,
} from 'react';

interface ProviderConnectionContextValue {
  isConnectedToProvider: Record<string, boolean>; // Adjust the type as needed
  setIsConnectedToProvider: (connectionData: Record<string, boolean>) => void;
}

export const ProviderConnectionContext = createContext<ProviderConnectionContextValue>({
  isConnectedToProvider: {},
  setIsConnectedToProvider: () => {},
});

export const useProviderConnection = () => {
  const context = useContext(ProviderConnectionContext);

  if (!context) {
    throw new Error('useProviderConnection must be used within a ProviderConnectionProvider');
  }

  return context;
};

type ProviderConnectionContextProviderProps = {
  children?: React.ReactNode;
};

export function ProviderConnectionProvider({ children }: ProviderConnectionContextProviderProps) {
  const [isConnectedToProvider, setIsConnectedToProvider] = useState<Record<string, boolean>>({});

  const contextValue = useMemo(() => ({
    isConnectedToProvider,
    setIsConnectedToProvider,
  }), [isConnectedToProvider]);

  return (
    <ProviderConnectionContext.Provider value={contextValue}>
      {children}
    </ProviderConnectionContext.Provider>
  );
}
