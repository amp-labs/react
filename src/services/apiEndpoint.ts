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
 * With neither set, the US production endpoint is used.
 */

/** US production endpoint. Used when no region is given. */
export const PROD_US_ENDPOINT = "https://api.withampersand.com";

/** EU production endpoint. */
export const PROD_EU_ENDPOINT = "https://api.eu.withampersand.com";

/**
 * Production endpoints keyed by the `region` option. No region means US.
 * Add an entry here to support another region.
 */
const REGIONAL_ENDPOINTS: Record<string, string> = {
  us: PROD_US_ENDPOINT,
  eu: PROD_EU_ENDPOINT,
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
        return PROD_US_ENDPOINT;
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

/** Values already reported, so a bad region logs once instead of on every render. */
const warnedRegions = new Set<string>();

function warnOnce(key: string, message: string): void {
  if (warnedRegions.has(key)) return;
  warnedRegions.add(key);
  console.error(message);
}

/**
 * Validates and canonicalises a region, returning undefined (meaning "use the US endpoint")
 * for anything unrecognised. Builders reach this through a cast, so the value is untyped at
 * runtime and may be any shape.
 */
function normalizeRegion(region?: unknown): string | undefined {
  if (region === undefined || region === null) return undefined;

  if (typeof region !== "string") {
    warnOnce(
      `type:${typeof region}`,
      `Ampersand region must be a string, received ${typeof region}. Using ${PROD_US_ENDPOINT}.`,
    );
    return undefined;
  }

  const normalized = region.trim().toLowerCase();
  if (!normalized) return undefined;

  // Own-property check only: a plain object inherits keys such as "constructor" and
  // "__proto__", which would otherwise resolve to a function or prototype object.
  if (!Object.prototype.hasOwnProperty.call(REGIONAL_ENDPOINTS, normalized)) {
    warnOnce(
      `region:${normalized}`,
      `Unknown Ampersand region "${region}". Expected one of: ` +
        `${Object.keys(REGIONAL_ENDPOINTS).join(", ")}. Using ${PROD_US_ENDPOINT}.`,
    );
    return undefined;
  }

  return normalized;
}

/**
 * Resolves a region to its endpoint, falling back to the US endpoint for an unknown region.
 */
function getRegionalEndpoint(region?: unknown): string {
  const normalized = normalizeRegion(region);
  return normalized ? REGIONAL_ENDPOINTS[normalized] : PROD_US_ENDPOINT;
}

/**
 * The API server origin (no version path), e.g. "https://api.eu.withampersand.com".
 * `REACT_APP_AMP_SERVER` takes priority over `region`.
 */
export function resolveApiEndpoint(region?: unknown): string {
  return getEnvEndpoint() ?? getRegionalEndpoint(region);
}

/**
 * The region is module state rather than context so that it stays out of the library's public
 * types (like the `variant` prop on InstallIntegration). `AmpersandProvider` sets it during
 * render — before any child effect or query runs — and readers resolve the endpoint lazily.
 */
let ampersandRegion: string | undefined;

export function setAmpersandRegion(region?: unknown): void {
  // Validated here, at the provider, so an invalid value is reported once rather than on
  // every request, and only a known region is ever stored.
  ampersandRegion = normalizeRegion(region);
}

export function getAmpersandRegion(): string | undefined {
  return ampersandRegion;
}
