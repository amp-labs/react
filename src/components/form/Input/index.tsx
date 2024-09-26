import { InputHTMLAttributes } from 'react';
import classNames from 'classnames';

import classes from './input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  type: string;
  className?: string;
  isError?: boolean;
}

export function Input({
  id, type, className, isError = false, ...rest
}: InputProps) {
  const defaultClassName = isError
    ? classNames(classes.inputError, classes.input) : classes.input;

  return (
    <input
      id={id}
      type={type}
      className={classNames(defaultClassName, className)}
      {...rest}
    />
  );
}
