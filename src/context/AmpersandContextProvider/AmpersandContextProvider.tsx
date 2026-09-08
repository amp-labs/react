/**
 * AmpersandProvider.tsx
 *
 * Takes API key and project ID. Fetches source, making it available to all child components.
 * Also optionally accepts theme styles object with CSS values.
 */

import React, { createContext, useContext, useMemo } from "react";
import { ResponseError } from "@generated/api/src";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AmpersandRegion, normalizeRegion } from "src/services/apiEndpoint";

import { ApiKeyProvider } from "../ApiKeyContextProvider";
import { ErrorStateProvider } from "../ErrorContextProvider";
import { JwtTokenProvider } from "../JwtTokenContextProvider";

interface AmpersandProviderProps {
  options: {
    apiKey?: string;
    /**
     * Use `project` instead of `projectId`.
     * @deprecated
     */
    projectId?: string;
    /**
     * `project` is the project ID or name.
     */
    project?: string;
    styles?: object;
    /**
     * Callback function to get a JWT token for authorization.
     * This function should return a Promise that resolves to a JWT token string.
     */
    getToken?: ({
      consumerRef,
      groupRef,
    }: {
      consumerRef: string;
      groupRef: string;
    }) => Promise<string>;
    /**
     * Internal, unsupported. Routes every API request to a regional endpoint
     * ("eu" -> https://api.eu.withampersand.com). Ignored when REACT_APP_AMP_SERVER is set.
     *
     * Typed `never` on purpose: setting it requires an explicit `@ts-expect-error`, which is
     * the acknowledgement that this is not part of the supported API. `never` (rather than
     * simply omitting the key) makes that gate hold for both an inline `options={{ ... }}`
     * literal and a pre-built `const options = { ... }` object — excess-property checking
     * alone only catches the former.
     *
     * Deliberately NOT tagged `@internal`: API Extractor strips `@internal` members from the
     * published .d.ts, and a stripped member is only caught by excess-property checking, which
     * would silently un-gate the pre-built-object form for every consumer of the package.
     */
    region?: never;
  };
  children: React.ReactNode;
}

/**
 * Internal props that widen `region` back to the values the library actually accepts.
 * This is not exported from the public API.
 */
interface AmpersandProviderInternalProps {
  options: Omit<AmpersandProviderProps["options"], "region"> & {
    region?: AmpersandRegion;
  };
  children: React.ReactNode;
}

interface AmpersandContextValue {
  options: AmpersandProviderProps["options"];
  projectIdOrName: string;
  /**
   * Validated region for this provider, or undefined for the default (US) endpoint.
   * Read it through `useAmpServer()` / `useAmpApiRoot()` rather than directly.
   *
   * @internal
   */
  region?: AmpersandRegion;
}

export const AmpersandContext = createContext<AmpersandContextValue | null>(
  null,
);

export function useAmpersandProviderProps(): AmpersandContextValue {
  const ampersandContext = useContext(AmpersandContext);

  if (!ampersandContext) {
    throw new Error(`Cannot call useAmpersandProvider unless your 
        component is wrapped with AmpersandProvider`);
  }

  return ampersandContext;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx client errors - these indicate user/data issues, not transient failures
        if (error instanceof ResponseError) {
          const status = error.response.status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        // Retry up to 3 times for other errors (network issues, 5xx, etc.)
        // This is react-query's default behavior, so we preserve it:
        // https://tanstack.com/query/v4/docs/framework/react/guides/query-retries
        return failureCount < 3;
      },
    },
  },
});

export function AmpersandProvider(props: AmpersandProviderProps) {
  const {
    options: { apiKey, projectId, project, getToken, region },
    children,
  } = props as AmpersandProviderInternalProps;

  const projectIdOrName = project || projectId;

  // Validated here rather than at each request, so an invalid value is reported once.
  const normalizedRegion = useMemo(() => normalizeRegion(region), [region]);

  const contextValue = useMemo<AmpersandContextValue>(
    () => ({
      options: props.options,
      projectIdOrName: projectIdOrName as string,
      region: normalizedRegion,
    }),
    [props.options, projectIdOrName, normalizedRegion],
  );

  if (projectId && project) {
    throw new Error(
      "Use AmpersandProvider either with projectId or project but not both.",
    );
  }
  if (!projectIdOrName) {
    throw new Error(
      "Cannot use AmpersandProvider without a projectId or name.",
    );
  }

  if (!apiKey && !getToken) {
    throw new Error(
      "Cannot use AmpersandProvider without an apiKey or getToken.",
    );
  }

  if (apiKey && getToken) {
    throw new Error(
      "Cannot use AmpersandProvider with both apiKey and getToken.",
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AmpersandContext.Provider value={contextValue}>
        <ErrorStateProvider>
          <JwtTokenProvider getTokenCallback={getToken || null}>
            <ApiKeyProvider value={apiKey || null}>{children}</ApiKeyProvider>
          </JwtTokenProvider>
        </ErrorStateProvider>
      </AmpersandContext.Provider>
    </QueryClientProvider>
  );
}
