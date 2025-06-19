import { sanitizeHtmlId } from "src/utils";

import { AccessibleLink } from "../ui-base/AccessibleLink";
import { LabelTooltip } from "../ui-base/Tooltip";

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
    <p
      style={{
        color: "var(--amp-colors-text-muted)",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <span>
        {url ? (
          <AccessibleLink href={url} newTab>
            <span style={{ textDecoration: "underline" }}>{inputName}</span>
          </AccessibleLink>
        ) : (
          <span>{inputName}</span>
        )}{" "}
        {prompt && (
          <LabelTooltip
            id={`docs-helper-text-${sanitizeHtmlId(inputName || prompt?.slice(0, 50))}`}
            tooltipText={prompt}
          />
        )}
      </span>
    </p>
  );
}
