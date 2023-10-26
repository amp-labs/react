import React, {
  createContext, useContext, useMemo, useState,
} from 'react';

export const LoadingContext = createContext<{
  isLoading: boolean;
  setLoadingState: React.Dispatch<React.SetStateAction<boolean>>;
} | undefined>(undefined);

export function useLoadingState() {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error('useLoadingState must be used within an AmpersandProvider');
  }

  return context;
}

type LoadingProviderProps = {
  children: React.ReactNode;
};

export function LoadingStateProvider(
  { children }: LoadingProviderProps,
) {
  const [isLoading, setLoadingState] = useState<boolean>(false);

  const contextValue = useMemo(
    () => ({ isLoading, setLoadingState }),
    [isLoading, setLoadingState],
  );

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
}
