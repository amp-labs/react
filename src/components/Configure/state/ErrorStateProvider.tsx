import React, {
  createContext, useContext, useMemo, useState,
} from 'react';

export type ErrorState = {
  [boundary in ErrorBoundary]: {
    [key: string]: boolean;
  };
};

export const ErrorContext = createContext<{
  errorState: ErrorState;
  setErrorState: React.Dispatch<React.SetStateAction<ErrorState>>;
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

export function ErrorStateProvider(
  { children }: ErrorProviderProps,
) {
  const [errorState, setErrorState] = useState<ErrorState>({} as ErrorState);

  const contextValue = useMemo(
    () => ({ errorState, setErrorState }),
    [errorState, setErrorState],
  );

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
}

export const setError = (
  boundary: ErrorBoundary,
  key: string,
  setErrorState: React.Dispatch<React.SetStateAction<ErrorState>>,
) => {
  setErrorState((prevState) => {
    const newErrorState = {
      ...prevState,
    };
    newErrorState[boundary] = newErrorState[boundary] || {};
    newErrorState[boundary][key] = true;
    return newErrorState;
  });
};

export const isError = (
  boundary: ErrorBoundary,
  key: string,
  errorState: ErrorState,
) => !!errorState[boundary]?.[key];

export const removeError = (
  boundary: ErrorBoundary,
  key: string,
  setErrorState: React.Dispatch<React.SetStateAction<ErrorState>>,
) => {
  setErrorState((prevState) => {
    const newErrorState = {
      ...prevState,
    };
    delete newErrorState[boundary][key];
    return newErrorState;
  });
};

export const resetBoundary = (
  boundary: ErrorBoundary,
  setErrorState: React.Dispatch<React.SetStateAction<ErrorState>>,
) => {
  setErrorState((prevState) => {
    const newErrorState = {
      ...prevState,
    };
    newErrorState[boundary] = {};
    return newErrorState;
  });
};

export const setErrors = (
  boundary: ErrorBoundary,
  keys: string[],
  setErrorState: React.Dispatch<React.SetStateAction<ErrorState>>,
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
};

export enum ErrorBoundary {
  MAPPING = 'mappingError',
  INTEGRATION_LIST = 'integrationListError',
  PROJECT_ERROR_BOUNDARY = 'projectError',
}
