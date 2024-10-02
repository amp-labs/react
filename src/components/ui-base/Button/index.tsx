import { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';

import classes from './button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  type: 'button' | 'submit' | 'reset';
  variant?: 'danger';
}

export function Button({
  className, style, type, children, variant, ...rest
}: ButtonProps) {
  const buttonClass = (variant === 'danger') ? classNames(classes.button, classes.danger) : classes.button;

  return (
    <button
      // button type is a required pass through prop
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={classNames(buttonClass, className)}
      style={style}
      {...rest}
    >{children}
    </button>
  );
}
