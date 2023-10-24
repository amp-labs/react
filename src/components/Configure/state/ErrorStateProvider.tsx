import React, {
    createContext, useContext, useMemo, useState,
} from 'react';

export const ErrorContext = createContext<{
    errorState: Object;
    setErrorState: React.Dispatch<React.SetStateAction<Object>>;
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
    const [errorState, setErrorState] = useState<Object>({});

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
