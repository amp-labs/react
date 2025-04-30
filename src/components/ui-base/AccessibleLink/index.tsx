import React from "react";
import classNames from "classnames";

import classes from "./link.module.css";

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
  href,
  className,
  style,
  label,
  children,
  newTab = false,
}: AccessibleLinkProps) {
  return (
    <a
      className={classNames(classes.link, className)}
      style={style}
      href={href}
      aria-label={label || undefined}
      target={newTab ? "_blank" : "_self"}
      rel={newTab ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}
