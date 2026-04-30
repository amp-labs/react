export const SALESFORCE_PROVIDERS = [
  "salesforce",
  "salesforceSandbox",
] as const;
export type SalesforceProvider = (typeof SALESFORCE_PROVIDERS)[number];

export function isSalesforceProvider(
  provider: string | undefined | null,
): provider is SalesforceProvider {
  return (
    !!provider && (SALESFORCE_PROVIDERS as readonly string[]).includes(provider)
  );
}

export const SALESFORCE_WORKSPACE_FIELD = "workspace";
