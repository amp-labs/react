import { createContext } from 'react';

export const ApiKeyContext = createContext<string | null>(null);

export const ApiKeyProvider = ApiKeyContext.Provider;
