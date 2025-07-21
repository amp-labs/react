import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { jwtVerify } from "jose";

// Token cache types
interface TokenCacheEntry {
  token: string;
  expiresAt: number;
}

const createCacheKey = (consumerRef: string, groupRef: string) =>
  `${consumerRef}:${groupRef}`;

type TokenCache = Map<string, TokenCacheEntry>;

interface JwtTokenContextValue {
  getToken: (consumerRef: string, groupRef: string) => Promise<string>;
  clearToken: () => void;
}

export const JwtTokenContext = createContext<JwtTokenContextValue | null>(null);

interface JwtTokenProviderProps {
  getTokenCallback:
    | ((consumerRef: string, groupRef: string) => Promise<string>)
    | null;
  children: React.ReactNode;
}

// JWT token expiration extraction using jose library
const getTokenExpirationTime = async (
  token: string,
): Promise<number | null> => {
  try {
    // Use jose library to decode and verify the JWT token
    // We're not verifying the signature since we just want to extract the payload
    const decoded = await jwtVerify(token, new Uint8Array(0), {
      algorithms: [], // Skip signature verification
    });

    const payload = decoded.payload;
    if (payload.exp && typeof payload.exp === "number") {
      // JWT exp is in seconds, convert to milliseconds
      return payload.exp * 1000;
    }

    return null;
  } catch (error) {
    console.warn("Failed to decode JWT token:", error);
    return null;
  }
};

export function JwtTokenProvider({
  getTokenCallback,
  children,
}: JwtTokenProviderProps) {
  const [tokenCache, setTokenCache] = useState<TokenCache>(new Map());

  const getCachedToken = useCallback(
    (consumerRef: string, groupRef: string): string | null => {
      const cacheKey = createCacheKey(consumerRef, groupRef);
      const cached = tokenCache.get(cacheKey);

      if (cached && cached.expiresAt > Date.now()) {
        return cached.token;
      }

      // Remove expired token from cache
      if (cached && cached.expiresAt < Date.now()) {
        setTokenCache((prev) => {
          const newCache = new Map(prev);
          newCache.delete(cacheKey);
          return newCache;
        });
      }

      return null;
    },
    [tokenCache],
  );

  const setCachedToken = useCallback(
    async (consumerRef: string, groupRef: string, token: string) => {
      const cacheKey = createCacheKey(consumerRef, groupRef);

      // Extract actual expiration time from JWT token using jose library
      const tokenExpiration = await getTokenExpirationTime(token);
      const expiresAt = tokenExpiration || Date.now() + 3600 * 1000; // fallback to 1 hour

      const cacheEntry: TokenCacheEntry = { token, expiresAt };

      setTokenCache((prev) => new Map(prev).set(cacheKey, cacheEntry));

      // Also store in localStorage for persistence
      try {
        localStorage.setItem(
          `amp-labs_jwt_${cacheKey}`,
          JSON.stringify(cacheEntry),
        );
      } catch {
        console.warn("Failed to store JWT token in localStorage");
      }
    },
    [],
  );

  const clearToken = useCallback(() => {
    setTokenCache(new Map());
    // Clear from localStorage
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith("amp-labs_jwt_")) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      console.warn("Failed to clear JWT tokens from localStorage");
    }
  }, []);

  // Load cached tokens from localStorage on mount
  useEffect(() => {
    try {
      const newCache: TokenCache = new Map();
      const keys = Object.keys(localStorage);

      keys.forEach((key) => {
        if (key.startsWith("amp-labs_jwt_")) {
          const cacheKey = key.replace("amp-labs_jwt_", "");
          const stored = localStorage.getItem(key);
          if (stored) {
            try {
              const cacheEntry: TokenCacheEntry = JSON.parse(stored);
              if (cacheEntry.expiresAt > Date.now()) {
                newCache.set(cacheKey, cacheEntry);
              } else {
                localStorage.removeItem(key);
              }
            } catch {
              localStorage.removeItem(key);
            }
          }
        }
      });

      if (newCache.size > 0) {
        setTokenCache(newCache);
      }
    } catch {
      console.warn("Failed to load JWT tokens from localStorage");
    }
  }, []);

  const getToken = useCallback(
    async (consumerRef: string, groupRef: string): Promise<string> => {
      // First try to get from cache
      const cachedToken = getCachedToken(consumerRef, groupRef);
      if (cachedToken) return cachedToken;

      if (!getTokenCallback) {
        console.error("getTokenCallback is not set");
        throw new Error("getTokenCallback is not set");
      }

      // If not cached, fetch new token
      try {
        const token = await getTokenCallback(consumerRef, groupRef);
        await setCachedToken(consumerRef, groupRef, token);
        return token;
      } catch {
        console.error("Failed to get JWT token");
        throw new Error("Failed to get JWT token");
      }
    },
    [getTokenCallback, getCachedToken, setCachedToken],
  );

  const contextValue: JwtTokenContextValue = {
    getToken,
    clearToken,
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
