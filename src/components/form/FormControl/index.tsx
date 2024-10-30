// FormControl.tsx
import React from 'react';
import classNames from 'classnames';

import styles from './formControl.module.css';

type FormControlProps = {
  id: string;
  label?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  children: React.ReactNode;
};

/**
 * mimics the FormControl component from chakra-ui
 * renders a form control with a label and error message
 * @param param0
 * @returns
 */
export function FormControl({
  id,
  label,
  isRequired = false,
  isDisabled = false,
  isInvalid = false,
  errorMessage,
  children,
}: FormControlProps) {
  return (
    <div
      className={classNames(styles.formControl, {
        [styles.disabled]: isDisabled,
      })}
    >
      {label && (
      <label
        htmlFor={id}
        className={classNames(styles.formLabel, { [styles.formLabelRequired]: isRequired })}
      >
        {label}
      </label>
      )}
      <div
        id={id}
        className={classNames(styles.formInput, { [styles.formInputInvalid]: isInvalid })}
      >
        {children}
      </div>
      {isInvalid && errorMessage && (
      <div className={styles.formError} role="alert">
        {errorMessage}
      </div>
      )}
    </div>
  );
}
