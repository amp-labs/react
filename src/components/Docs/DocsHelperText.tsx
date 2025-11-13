import { AccessibleLink } from "../ui-base/AccessibleLink";

import { MetadataPromptText } from "./MetadataPromptText";

type DocsHelperTextProps = {
  url: string;
  providerDisplayName: string;
  credentialName: string;
  prompt?: string;
};

export function DocsHelperText({
  url,
  providerDisplayName,
  credentialName,
  prompt,
}: DocsHelperTextProps) {
  return (
    <div style={{ marginBottom: "0.5rem" }}>
      <p
        style={{
          color: "var(--amp-colors-text-muted)",
          marginBottom: prompt ? "0.25rem" : "0rem",
          lineHeight: "1.5",
        }}
      >
        <AccessibleLink href={url} newTab>
          <span style={{ textDecoration: "underline" }}>Learn more</span>
        </AccessibleLink>{" "}
        about where to find your {providerDisplayName} {credentialName}.
      </p>
      {prompt && <MetadataPromptText prompt={prompt} />}
    </div>
  );
}
