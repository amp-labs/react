/**
 * AmpersandProvider.tsx
 *
 * Takes API key and project ID. Fetches source, making it available to all child components.
 * Also optionally accepts theme styles object with CSS values.
 */

import React, { createContext, useContext } from "react";
import { ResponseError } from "@generated/api/src";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setAmpersandRegion } from "src/services/apiEndpoint";

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
  };
  children: React.ReactNode;
}

/**
 * Internal props that extend the public options with the region option.
 * This is not exported from the public API.
 */
interface AmpersandProviderInternalProps {
  options: AmpersandProviderProps["options"] & {
    /**
     * Routes every API request to a regional endpoint, e.g. "eu" for
     * https://api.eu.withampersand.com. Defaults to the global endpoint.
     * Ignored when REACT_APP_AMP_SERVER is set.
     */
    region?: string;
  };
  children: React.ReactNode;
}

interface AmpersandContextValue {
  options: AmpersandProviderProps["options"];
  projectIdOrName: string;
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

  // Set during render, not in an effect: children fire API requests from their own effects,
  // which run before the parent's, so an effect here would land after the first request.
  setAmpersandRegion(region);

  const projectIdOrName = project || projectId;
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

  const contextValue: AmpersandContextValue = {
    options: props.options,
    projectIdOrName,
  };

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
