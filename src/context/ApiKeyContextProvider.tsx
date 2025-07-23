import { createContext, useContext } from "react";

import { useJwtToken } from "./JwtTokenContextProvider";

export const ApiKeyContext = createContext<string | null>(null);

export const ApiKeyProvider = ApiKeyContext.Provider;

export const useApiKey = () => {
  const apiKey = useContext(ApiKeyContext);
  const { getToken } = useJwtToken();

  if (apiKey === null && getToken == null) {
    console.error(
      "useApiKey must be used within an ApiKeyProvider, or there is no JWT token callback",
    );
  }

  return apiKey;
};
