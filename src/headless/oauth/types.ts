/**
 * Types for headless OAuth connection management.
 */

import type { ProviderMetadataInfo } from "@generated/api/src";

/** Payload shape received from the OAuth popup via postMessage. */
export type OAuthAuthorizationEvent =
  | {
      eventType: "AUTHORIZATION_SUCCEEDED";
      data: { connection: string };
    }
  | {
      eventType: "AUTHORIZATION_FAILED";
      data: { error: string };
    };

/** Parameters for creating a new OAuth connection. */
export interface CreateOAuthConnectionParams {
  provider: string;
  consumerRef: string;
  groupRef: string;
  consumerName?: string;
  groupName?: string;
  providerWorkspaceRef?: string;
  providerMetadata?: Record<string, ProviderMetadataInfo>;
}

/** Parameters for updating an existing OAuth connection. */
export interface UpdateOAuthConnectionParams {
  connectionId: string;
}

/** Discriminated union for create vs update OAuth flows. */
export type OAuthConnectionMode =
  | { type: "create"; params: CreateOAuthConnectionParams }
  | { type: "update"; params: UpdateOAuthConnectionParams };

/** Configuration for the OAuth popup window. */
export interface OAuthPopupOptions {
  width?: number;
  height?: number;
}

/** Callbacks for OAuth flow completion. */
export interface OAuthCallbacks {
  onSuccess?: (connectionId: string) => void;
  onError?: (error: Error) => void;
}
