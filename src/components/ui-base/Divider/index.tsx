import { Divider as ChakraDivider } from '@chakra-ui/react';

import { isChakraRemoved } from '../constant';

import classes from './divider.module.css';

export function Divider({ className, style }:
{ className?: string, style?: React.CSSProperties }) {
  if (isChakraRemoved) {
    return (
      <hr
        className={className ? `${classes.divider} ${className}` : classes.divider}
        style={style}
      />
    );
  }

  return (
    <ChakraDivider className={className} style={style} />
  );
}
