import React, {
  createContext, useCallback,
  useContext, useMemo, useState,
} from 'react';

export enum ErrorBoundary {
  MAPPING = 'mappingError',
  INTEGRATION_LIST = 'integrationListError',
  PROJECT = 'projectError',
  CONNECTION_LIST = 'connectionListError',
  HYDRATED_REVISION = 'hydratedRevisionError',
  INSTALLATION_LIST = 'installationListError',
}

export type ErrorState = {
  [boundary in ErrorBoundary]: {
    [key: string]: boolean;
  };
};

export const ErrorContext = createContext<{
  errorState: ErrorState;
  setErrorState: React.Dispatch<React.SetStateAction<ErrorState>>;
  resetBoundary:(boundary: ErrorBoundary) => void;
  setError: (boundary: ErrorBoundary, key: string) => void;
  isError: (boundary: ErrorBoundary, key: string) => boolean;
  removeError: (boundary: ErrorBoundary, key: string) => void;
  setErrors: (boundary: ErrorBoundary, keys: string[]) => void;
} | undefined>(undefined);

export function useErrorState() {
  const context = useContext(ErrorContext);

  if (!context) {
    throw new Error('useErrorState must be used within a ErrorProvider');
  }

  return context;
}

type ErrorProviderProps = {
  children: React.ReactNode;
};

const initialState: ErrorState = (() => {
  const obj = {} as ErrorState;
  Object.values(ErrorBoundary).forEach((key) => {
    obj[key] = {};
  });
  return obj;
})();

export function ErrorStateProvider(
  { children }: ErrorProviderProps,
) {
  const [errorState, setErrorState] = useState<ErrorState>(initialState);

  const setError = useCallback((
    boundary: ErrorBoundary,
    key: string,
  ) => {
    setErrorState((prevState) => {
      const newErrorState = {
        ...prevState,
      };
      newErrorState[boundary] = newErrorState[boundary] || {};
      newErrorState[boundary][key] = true;
      return newErrorState;
    });
  }, [setErrorState]);

  const isError = useCallback((
    boundary: ErrorBoundary,
    key: string,
  ): boolean => !!errorState[boundary]?.[key], [errorState]);

  const removeError = useCallback((
    boundary: ErrorBoundary,
    key: string,
  ) => {
    setErrorState((prevState) => {
      const newErrorState = {
        ...prevState,
      };
      delete newErrorState[boundary]?.[key];
      return newErrorState;
    });
  }, [setErrorState]);

  const resetBoundary = useCallback((
    boundary: ErrorBoundary,
  ) => {
    setErrorState((prevState) => {
      const newErrorState = {
        ...prevState,
      };
      newErrorState[boundary] = {};
      return newErrorState;
    });
  }, [setErrorState]);

  const setErrors = useCallback((
    boundary: ErrorBoundary,
    keys: string[],
  ) => {
    setErrorState((prevState) => {
      const newErrorState = {
        ...prevState,
      };
      newErrorState[boundary] = newErrorState[boundary] || {};
      keys.forEach((key) => {
        newErrorState[boundary][key] = true;
      });
      return newErrorState;
    });
  }, [setErrorState]);

  const contextValue = useMemo(
    () => ({
      errorState, setErrorState, setError, isError, removeError, resetBoundary, setErrors,
    }),
    [errorState, setErrorState, setError, isError, removeError, resetBoundary, setErrors],
  );

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
}
