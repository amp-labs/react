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
      <LabelTooltip id={`docs-helper-text-${inputName}`} tooltipText={prompt} />
    </p>
  );
}
