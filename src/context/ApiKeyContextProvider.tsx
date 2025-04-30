import { createContext, useContext } from "react";

export const ApiKeyContext = createContext<string | null>(null);

export const ApiKeyProvider = ApiKeyContext.Provider;

export const useApiKey = () => {
  const apiKey = useContext(ApiKeyContext);

  if (apiKey === null) {
    throw new Error("useApiKey must be used within an ApiKeyProvider");
  }

  return apiKey;
};
