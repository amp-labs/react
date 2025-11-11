import { AccessibleLink } from "../ui-base/AccessibleLink";
import { MetadataPromptText } from "./MetadataPromptText";

type DocsHelperTextProps = {
  url?: string;
  prompt?: string;
  inputName: string;
};

export function DocsHelperTextHeader({
  url,
  prompt,
  inputName,
}: DocsHelperTextProps) {
  return (
    <div>
      <p
        style={{
          color: "var(--amp-colors-text-muted)",
          marginBottom: "0.25rem",
          lineHeight: "1.5",
        }}
      >
        {url ? (
          <AccessibleLink href={url} newTab>
            <span style={{ textDecoration: "underline" }}>{inputName}</span>
          </AccessibleLink>
        ) : (
          <span>{inputName}</span>
        )}
      </p>
      {prompt && <MetadataPromptText prompt={prompt} />}
    </div>
  );
}
