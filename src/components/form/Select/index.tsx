import { SelectHTMLAttributes } from "react";
import classNames from "classnames";

import classes from "../Input/input.module.css";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  className?: string;
  isError?: boolean;
}

export function Select({
  id,
  className,
  isError = false,
  ...rest
}: SelectProps) {
  const defaultClassName = isError
    ? classNames(classes.inputError, classes.input)
    : classes.input;

  return (
    <select id={id} className={classNames(defaultClassName, className)} {...rest} />
  );
}
