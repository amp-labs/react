import React from 'react';
import { Link } from '@chakra-ui/react';

import { isChakraRemoved } from '../constant';

import classes from './link.module.css';

interface AccessibleLinkProps {
  href: string;
  label?: string;
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
  newTab?: boolean;
}

/**
 * native link component with accessibility features
 * @param param0
 * @returns
 */
export function AccessibleLink({
  href, className, style, label, children, newTab = false,
}: AccessibleLinkProps) {
  if (!isChakraRemoved) {
    return (
      <Link
        href={href}
        className={className}
        style={style}
        aria-label={label || undefined}
        target={newTab ? '_blank' : '_self'}
        rel={newTab ? 'noopener noreferrer' : undefined}
        color="#737373"
      >
        {children}
      </Link>
    );
  }
  return (
    <a
      className={classes.link}
      style={style}
      href={href}
      aria-label={label || undefined}
      target={newTab ? '_blank' : '_self'}
      rel={newTab ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  );
}
