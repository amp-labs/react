import { ProviderApp } from "@generated/api/src";

export function getPackageInstallUrl(providerApp?: ProviderApp): string | null {
  const url = providerApp?.metadata?.providerParams?.packageInstallURL;
  return typeof url === "string" && url.length > 0 ? url : null;
}
