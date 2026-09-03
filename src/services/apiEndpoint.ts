/**
 * Resolution of the Ampersand API endpoint.
 *
 * Two inputs decide which server the library talks to:
 *
 * 1. `REACT_APP_AMP_SERVER` — always wins, so the Ampersand team can point a build at
 *    local / dev / staging (or an arbitrary URL).
 * 2. `region` — an internal, undocumented option on `AmpersandProvider` that is not part of
 *    the public TypeScript types. Ignored whenever `REACT_APP_AMP_SERVER` is set.
 *
 * With neither set, the default (global) production endpoint is used.
 */

export const PROD_ENDPOINT = "https://api.withampersand.com";

/**
 * Known regional endpoints, keyed by the `region` option. The default (no region) is the
 * global production endpoint above; add a new entry here to support another region.
 */
const REGIONAL_ENDPOINTS: Record<string, string> = {
  eu: "https://api.eu.withampersand.com",
};

/**
 * Resolves `REACT_APP_AMP_SERVER`, or null when it is unset/empty (in which case the region
 * and then the default endpoint apply).
 */
function getEnvEndpoint(): string | null {
  try {
    const ENV_SERVER = process.env.REACT_APP_AMP_SERVER;
    switch (ENV_SERVER) {
      case "local":
        return "http://localhost:8080";
      case "dev":
        return "https://dev-api.withampersand.com";
      case "staging":
        return "https://staging-api.withampersand.com";
      case "prod":
        return PROD_ENDPOINT;
      case "mock":
        return "http://127.0.0.1:4010";
      case undefined:
      case "":
        return null;
      default:
        // The user may provide an arbitrary URL here if they want to.
        return ENV_SERVER;
    }
  } catch {
    // process may not be defined in every consumer's bundle
    return null;
  }
}

/**
 * Resolves a region to its endpoint, falling back to the default endpoint for an unknown region.
 */
function getRegionalEndpoint(region?: string): string {
  if (!region) return PROD_ENDPOINT;

  const endpoint = REGIONAL_ENDPOINTS[region.trim().toLowerCase()];
  if (!endpoint) {
    console.error(
      `Unknown Ampersand region "${region}". Falling back to ${PROD_ENDPOINT}.`,
    );
    return PROD_ENDPOINT;
  }

  return endpoint;
}

/**
 * The API server origin (no version path), e.g. "https://api.eu.withampersand.com".
 * `REACT_APP_AMP_SERVER` takes priority over `region`.
 */
export function resolveApiEndpoint(region?: string): string {
  return getEnvEndpoint() ?? getRegionalEndpoint(region);
}

/**
 * The region is module state rather than context so that it stays out of the library's public
 * types (like the `variant` prop on InstallIntegration). `AmpersandProvider` sets it during
 * render — before any child effect or query runs — and readers resolve the endpoint lazily.
 */
let ampersandRegion: string | undefined;

export function setAmpersandRegion(region?: string): void {
  ampersandRegion = region;
}

export function getAmpersandRegion(): string | undefined {
  return ampersandRegion;
}
