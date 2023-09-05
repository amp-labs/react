import {
  createContext, useContext, useMemo, useState,
} from 'react';

interface SubdomainContextValue {
  subdomain: string;
  setSubdomain: React.Dispatch<React.SetStateAction<string>>;
}

export const SubdomainContext = createContext<SubdomainContextValue>({
  subdomain: '',
  setSubdomain: () => {},
});

export const useSubdomain = () => {
  const context = useContext(SubdomainContext);

  if (!context) {
    throw new Error('useSubdomain must be used within a SubdomainProvider');
  }

  return context;
};

type SubdomainProviderProps = {
  children?: React.ReactNode;
};

export function SubdomainProvider({ children }: SubdomainProviderProps) {
  const [subdomain, setSubdomain] = useState('');

  const contextValue = useMemo(() => ({
    subdomain,
    setSubdomain,
  }), [subdomain]);

  return (
    <SubdomainContext.Provider value={contextValue}>
      {children}
    </SubdomainContext.Provider>
  );
}
