import { ButtonHTMLAttributes } from 'react';

import classes from './button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  type: 'button' | 'submit' | 'reset';
}

export function Button({
  className, style, type, children, ...rest
}: ButtonProps) {
  return (
    <button
      // button type is a required pass through prop
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={className ? `${classes.button} ${className}` : classes.button}
      style={style}
      {...rest}
    >{children}
    </button>
  );
}
