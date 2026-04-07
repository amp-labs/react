import { useState } from "react";
import classNames from "classnames";

import { AccessibleLink } from "../ui-base/AccessibleLink";

import { MetadataPromptText } from "./MetadataPromptText";

import styles from "./DocsHelperTextMinimal.module.css";

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
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <p className={styles.header}>
        <span>
          {url ? (
            <AccessibleLink href={url} newTab>
              <span style={{ textDecoration: "underline" }}>{inputName}</span>
            </AccessibleLink>
          ) : (
            <span>{inputName}</span>
          )}
        </span>
        {prompt && (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className={styles.helpButton}
          >
            <span
              className={classNames(styles.chevron, {
                [styles.chevronExpanded]: isExpanded,
              })}
            >
              ▸
            </span>
            Help
          </button>
        )}
      </p>
      <div
        className={classNames(styles.promptWrapper, {
          [styles.promptWrapperExpanded]: isExpanded,
        })}
      >
        {prompt && <MetadataPromptText prompt={prompt} />}
      </div>
    </div>
  );
}
