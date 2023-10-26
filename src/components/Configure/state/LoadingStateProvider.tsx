import React, {
  createContext, useContext, useMemo, useState,
} from 'react';

export const LoadingContext = createContext<{
  loadingState: boolean;
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
  const [loadingState, setLoadingState] = useState<boolean>(false);

  const contextValue = useMemo(
    () => ({ loadingState, setLoadingState }),
    [loadingState, setLoadingState],
  );

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
}
