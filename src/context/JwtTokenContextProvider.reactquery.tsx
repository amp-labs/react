/**
 * JWT Token Provider using React Query
 *
 * React Query handles all caching, expiration, and refetching automatically.
 * No manual cache management needed!
 */

import { createContext, useCallback, useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { decodeJwt } from "jose";

interface JwtTokenContextValue {
  getToken?: ({
    consumerRef,
    groupRef,
  }: {
    consumerRef: string;
    groupRef: string;
  }) => Promise<string>;
}

const JwtTokenContext = createContext<JwtTokenContextValue | null>(null);

interface JwtTokenProviderProps {
  getTokenCallback:
    | (({
        consumerRef,
        groupRef,
      }: {
        consumerRef: string;
        groupRef: string;
      }) => Promise<string>)
    | null;
  children: React.ReactNode;
}

interface TokenData {
  token: string;
  expiresAt: number;
}

// const DEFAULT_TOKEN_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes

/**
 * Extract JWT token expiration time
 */
const getTokenExpirationTime = (token: string): number | null => {
  try {
    const payload = decodeJwt(token);
    console.log("[JWT Debug] Decoded JWT payload", { payload });

    if (payload.exp && typeof payload.exp === "number") {
      const expirationTime = payload.exp * 1000; // Convert seconds to milliseconds
      console.log("[JWT Debug] Token expiration extracted", {
        exp: payload.exp,
        expirationTime,
        expiresAt: new Date(expirationTime).toISOString(),
      });
      return expirationTime;
    }

    console.warn("[JWT Debug] No exp field in JWT payload");
    return null;
  } catch (error) {
    console.warn("[JWT Debug] Failed to decode JWT token:", error);
    return null;
  }
};

/**
 * Create a query key for the token
 */
const createTokenQueryKey = (consumerRef: string, groupRef: string) => [
  "jwt-token",
  consumerRef,
  groupRef,
];

/**
 * JWT Token Provider using React Query
 * React Query handles all caching automatically!
 */
export function JwtTokenProvider({
  getTokenCallback,
  children,
}: JwtTokenProviderProps) {
  const queryClient = useQueryClient();

  const getToken = useCallback(
    async ({
      consumerRef,
      groupRef,
    }: {
      consumerRef: string;
      groupRef: string;
    }): Promise<string> => {
      if (!getTokenCallback) {
        throw new Error("JWT token callback not provided");
      }

      const queryKey = createTokenQueryKey(consumerRef, groupRef);

      console.log("[JWT Debug] getToken called", { consumerRef, groupRef });

      // Let React Query handle caching and expiration
      const data = await queryClient.fetchQuery({
        queryKey,
        queryFn: async (): Promise<TokenData> => {
          console.log(
            "[JWT Debug] Calling getTokenCallback (via React Query)",
            { consumerRef, groupRef },
          );

          const token = await getTokenCallback({ consumerRef, groupRef });
          const expirationTime = await getTokenExpirationTime(token);
          if (!expirationTime) {
            console.warn(
              "Failed to get token expiration time, using default expiration",
            );
          }
          console.log("[JWT Debug] Token expiration time", { expirationTime });
          const expiresAt = expirationTime || Date.now();

          console.log("[JWT Debug] Token fetched and cached", {
            consumerRef,
            groupRef,
            expiresAt: new Date(expiresAt).toISOString(),
            expiresInMs: expiresAt - Date.now(),
            expiresInMinutes: Math.floor((expiresAt - Date.now()) / 60000),
          });

          return { token, expiresAt };
        },
        // React Query will use existing cache if available and not stale
        staleTime: (query) => {
          const data = query.state.data as TokenData | undefined;
          if (!data) return 0;

          const timeUntilExpiry = data.expiresAt - Date.now();

          // Token is stale when it expires (with 1 min buffer)
          const staleTime = Math.max(0, timeUntilExpiry - 60000);

          console.log("[JWT Debug] Token staleTime calculated", {
            consumerRef,
            groupRef,
            staleTime,
            staleInMinutes: Math.floor(staleTime / 60000),
          });

          return staleTime;
        },
        gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      });

      return data.token;
    },
    [getTokenCallback, queryClient],
  );

  const contextValue: JwtTokenContextValue = {
    getToken: getTokenCallback ? getToken : undefined,
  };

  return (
    <JwtTokenContext.Provider value={contextValue}>
      {children}
    </JwtTokenContext.Provider>
  );
}

export const useJwtToken = () => {
  const context = useContext(JwtTokenContext);
  if (!context) {
    throw new Error("useJwtToken must be used within a JwtTokenProvider");
  }
  return context;
};
