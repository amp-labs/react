import Markdown from "react-markdown";

type MetadataPromptTextProps = {
  prompt: string;
};

export function MetadataPromptText({ prompt }: MetadataPromptTextProps) {
  return (
    <div
      style={{
        color: "var(--amp-colors-text-muted)",
        fontSize: "0.8125rem",
        marginTop: "0.375rem",
        marginBottom: "0.75rem",
        lineHeight: "1.5",
      }}
      className="metadata-prompt-text"
    >
      <Markdown
        components={{
          // Inline elements only - disable paragraphs to avoid extra spacing
          p: ({ children }) => <>{children}</>,
          // Style inline code
          code: ({ children }) => (
            <code
              style={{
                backgroundColor: "var(--amp-colors-background-muted, #f5f5f5)",
                padding: "0.125rem 0.25rem",
                borderRadius: "0.25rem",
                fontFamily: "monospace",
                fontSize: "0.875em",
              }}
            >
              {children}
            </code>
          ),
        }}
      >
        {prompt}
      </Markdown>
    </div>
  );
}
