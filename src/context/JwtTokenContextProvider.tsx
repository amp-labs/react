import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { decodeJwt } from "jose";

interface TokenCacheEntry {
  token: string;
  expiresAt: number;
}

const SESSION_STORAGE_PREFIX = "amp-labs_jwt_";

const DEFAULT_TOKEN_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes

const createCacheKey = (consumerRef: string, groupRef: string) =>
  `${consumerRef}:${groupRef}`;

const getSessionStorageKey = (cacheKey: string) =>
  `${SESSION_STORAGE_PREFIX}${cacheKey}`;

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

/**
 * Extract JWT token expiration time
 */
const getTokenExpirationTime = (token: string): number | null => {
  try {
    const payload = decodeJwt(token);

    if (payload.exp && typeof payload.exp === "number") {
      return payload.exp * 1000; // Convert seconds to milliseconds
    }

    return null;
  } catch (error) {
    console.warn("Failed to decode JWT token:", error);
    return null;
  }
};

/**
 * Simplified JWT token provider with cleaner caching logic
 */
export function JwtTokenProvider({
  getTokenCallback,
  children,
}: JwtTokenProviderProps) {
  const [tokenCache, setTokenCache] = useState<Map<string, TokenCacheEntry>>(
    new Map(),
  );

  // Load cached tokens from sessionStorage on mount
  useEffect(() => {
    try {
      const newCache = new Map<string, TokenCacheEntry>();
      const now = Date.now(); // current time in milliseconds

      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith(SESSION_STORAGE_PREFIX)) {
          const cacheKey = key.replace(SESSION_STORAGE_PREFIX, "");
          const stored = sessionStorage.getItem(key);

          if (stored) {
            try {
              const cacheEntry: TokenCacheEntry = JSON.parse(stored);
              if (cacheEntry.expiresAt > now) {
                newCache.set(cacheKey, cacheEntry);
              } else {
                sessionStorage.removeItem(key);
              }
            } catch {
              sessionStorage.removeItem(key);
            }
          }
        }
      });

      if (newCache.size > 0) {
        setTokenCache(newCache);
      }
    } catch {
      console.warn("Failed to load JWT tokens from sessionStorage");
    }
  }, []);

  /**
   * Get a cached token from the in-memory cache or sessionStorage
   * @param consumerRef - The consumer reference
   * @param groupRef - The group reference
   * @returns The cached token or null if not found
   */
  const getCachedToken = useCallback(
    (consumerRef: string, groupRef: string): string | null => {
      const cacheKey = createCacheKey(consumerRef, groupRef);
      const now = Date.now();

      // Check in-memory cache first
      const cached = tokenCache.get(cacheKey);
      if (cached && cached.expiresAt > now) {
        return cached.token;
      } else {
        tokenCache.delete(cacheKey);
      }

      // Check sessionStorage
      const sessionKey = getSessionStorageKey(cacheKey);
      const stored = sessionStorage.getItem(sessionKey);

      if (stored) {
        try {
          const cacheEntry: TokenCacheEntry = JSON.parse(stored);
          if (cacheEntry.expiresAt > now) {
            // Update in-memory cache
            setTokenCache((prev) => new Map(prev).set(cacheKey, cacheEntry));
            return cacheEntry.token;
          } else {
            sessionStorage.removeItem(sessionKey);
          }
        } catch {
          sessionStorage.removeItem(sessionKey);
        }
      }

      return null;
    },
    [tokenCache],
  );

  const setCachedToken = useCallback(
    async (consumerRef: string, groupRef: string, token: string) => {
      const cacheKey = createCacheKey(consumerRef, groupRef);
      const tokenExpiration = await getTokenExpirationTime(token);
      const expiresAt =
        tokenExpiration || Date.now() + DEFAULT_TOKEN_EXPIRATION_TIME;

      const cacheEntry: TokenCacheEntry = { token, expiresAt };

      // Update both in-memory cache
      setTokenCache((prev) => new Map(prev).set(cacheKey, cacheEntry));

      // Update sessionStorage
      try {
        sessionStorage.setItem(
          getSessionStorageKey(cacheKey),
          JSON.stringify(cacheEntry),
        );
      } catch {
        console.warn("Failed to store JWT token in sessionStorage");
      }
    },
    [],
  );

  const getToken = useCallback(
    async ({
      consumerRef,
      groupRef,
    }: {
      consumerRef: string;
      groupRef: string;
    }): Promise<string> => {
      // Check all caches first
      const cachedToken = getCachedToken(consumerRef, groupRef);
      if (cachedToken) {
        return cachedToken;
      }

      // Fetch new token if no callback provided
      if (!getTokenCallback) {
        throw new Error("JWT token callback not provided");
      }

      try {
        const token = await getTokenCallback({ consumerRef, groupRef });
        await setCachedToken(consumerRef, groupRef, token);
        return token;
      } catch (error) {
        console.error("Failed to get JWT token:", error);
        throw new Error("Failed to get JWT token");
      }
    },
    [getTokenCallback, getCachedToken, setCachedToken],
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
