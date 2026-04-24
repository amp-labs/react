import { ReactNode } from "react";
import Markdown from "react-markdown";

import styles from "./MetadataPromptText.module.css";

type MetadataPromptTextProps = {
  prompt: string;
  trailing?: ReactNode;
};

export function MetadataPromptText({
  prompt,
  trailing,
}: MetadataPromptTextProps) {
  return (
    <div className={styles.container}>
      <Markdown
        components={{
          // Inline elements only - disable paragraphs to avoid extra spacing
          p: ({ children }) => <>{children}</>,
          // Style inline code
          code: ({ children }) => (
            <code className={styles.code}>{children}</code>
          ),
        }}
      >
        {prompt}
      </Markdown>
      {trailing ? <> {trailing}</> : null}
    </div>
  );
}
