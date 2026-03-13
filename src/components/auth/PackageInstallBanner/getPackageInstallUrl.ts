import { MetadataItemInput } from "@generated/api/src";

/**
 * // TODO: remove dummy URL and implement real logic after testing
 * Extracts a packageInstallUrl from metadata inputs.
 * The field may be present on any metadata item but is not yet in the generated types.
 * Returns the first non-empty URL found, or null.
 */
export function getPackageInstallUrl(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _metadataInputs: MetadataItemInput[],
): string | null {
  // TODO: remove dummy URL and restore real logic after testing
  // return "https://login.salesforce.com/packaging/installPackage.apexp?p0=04t000000000000";

  // for (const item of metadataInputs) {
  //   const url = (item as unknown as Record<string, unknown>).packageInstallUrl;
  //   if (typeof url === "string" && url.length > 0) {
  //     return url;
  //   }
  // }
  return null;
}
