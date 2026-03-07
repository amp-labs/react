import { TextareaHTMLAttributes } from "react";
import classNames from "classnames";

import classes from "./textarea.module.css";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  isError?: boolean;
}

export function Textarea({
  className,
  isError = false,
  ...rest
}: TextareaProps) {
  const defaultClassName = isError
    ? classNames(classes.textareaError, classes.textarea)
    : classes.textarea;

  return (
    <textarea className={classNames(className, defaultClassName)} {...rest} />
  );
}
