import { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';

import classes from './button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  type: 'button' | 'submit' | 'reset';
  variant?: 'danger' | 'ghost';
}

export function Button({
  className, style, type, children, variant, ...rest
}: ButtonProps) {
  // button class is a combination of the base button class and the variant class
  const buttonClass = classNames(classes.button, {
    [classes.danger]: variant === 'danger',
    [classes.ghost]: variant === 'ghost',
    [className || '']: !!className,
  });

  return (
    <button
      // button type is a required pass through prop
       
      type={type}
      className={buttonClass}
      style={style}
      {...rest}
    >{children}
    </button>
  );
}
