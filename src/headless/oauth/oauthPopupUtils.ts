/**
 * Pure utility functions for OAuth popup window management.
 */

import { AMP_SERVER } from "src/services/api";

import type { OAuthPopupOptions } from "./types";

export const DEFAULT_POPUP_WIDTH = 600;
export const DEFAULT_POPUP_HEIGHT = 600;

/** Opens a centered popup window for OAuth authorization. */
export function openCenteredPopup(
  url: string,
  options?: OAuthPopupOptions,
): Window | null {
  const width = options?.width ?? DEFAULT_POPUP_WIDTH;
  const height = options?.height ?? DEFAULT_POPUP_HEIGHT;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2.5;
  const features = `width=${width},height=${height},left=${left},top=${top}`;
  return window.open(url, "OAuthPopup", features);
}

/** Checks whether a postMessage origin matches the Ampersand server. */
export function isValidOAuthOrigin(origin: string): boolean {
  return origin === AMP_SERVER;
}
