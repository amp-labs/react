import { createContext, useContext } from "react";

export const ApiKeyContext = createContext<string | null>(null);

export const ApiKeyProvider = ApiKeyContext.Provider;

export const useApiKey = () => {
  const apiKey = useContext(ApiKeyContext);
  return apiKey;
};
