import { sanitizeHtmlId } from "src/utils";

import { AccessibleLink } from "../ui-base/AccessibleLink";
import { LabelTooltip } from "../ui-base/Tooltip";

type DocsHelperTextProps = {
  url: string;
  prompt: string;
  inputName?: string;
};

export function DocsHelperTextMinimal({
  url,
  prompt,
  inputName,
}: DocsHelperTextProps) {
  return (
    <p style={{ color: "var(--amp-colors-text-muted)" }}>
      <AccessibleLink href={url} newTab>
        <span style={{ textDecoration: "underline" }}>Learn more</span>
      </AccessibleLink>
      {inputName && ` about ${inputName}. `}
      <LabelTooltip
        id={`docs-helper-text-${sanitizeHtmlId(inputName || prompt?.slice(0, 50))}`}
        tooltipText={prompt}
      />
    </p>
  );
}
