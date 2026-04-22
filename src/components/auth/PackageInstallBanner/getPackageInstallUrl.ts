import { ProviderApp } from "@generated/api/src";

/**
 * Reads the Salesforce managed-package install URL off the builder's
 * ProviderApp. Used only for Salesforce External Client App providers, where
 * a Salesforce admin must install a managed package into their org before the
 * end-user can authorize the OAuth connection.
 *
 * Source: `ProviderApp.metadata.providerParams.packageInstallURL` — the
 * per-project value the Ampersand customer (builder) sets in the dashboard
 * when configuring their Salesforce ProviderApp. Not sourced from
 * `ProviderInfo.metadata.input[]` (connection-level descriptors like workspace
 * subdomain) or `ProviderInfo.providerAppMetadata` (catalog-level descriptors
 * describing *which* fields to collect).
 *
 * Key casing matches the OpenAPI spec exactly: `packageInstallURL` (capital URL).
 *
 * Returns null when:
 *   - No ProviderApp exists for this provider (platform-managed credentials).
 *   - The builder left the URL blank.
 *   - Any link in the chain (metadata, providerParams) is undefined.
 */
export function getPackageInstallUrl(providerApp?: ProviderApp): string | null {
  const url = providerApp?.metadata?.providerParams?.packageInstallURL;
  return typeof url === "string" && url.length > 0 ? url : null;
}
