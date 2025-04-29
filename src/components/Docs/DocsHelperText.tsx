import { AccessibleLink } from "../ui-base/AccessibleLink";

type DocsHelperTextProps = {
  url: string;
  providerDisplayName: string;
  credentialName: string;
};

export function DocsHelperText({
  url,
  providerDisplayName,
  credentialName,
}: DocsHelperTextProps) {
  return (
    <p style={{ color: "var(--amp-colors-text-muted)" }}>
      <AccessibleLink href={url} newTab>
        <span style={{ textDecoration: "underline" }}>Learn more</span>
      </AccessibleLink>{" "}
      about where to find your {providerDisplayName} {credentialName}.
    </p>
  );
}
