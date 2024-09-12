import { Box as ChakraBox } from '@chakra-ui/react';

import { isChakraRemoved } from '../constant';

import classes from './box.module.css';

type BoxProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function Box({ children, className, style }: BoxProps) {
  if (!isChakraRemoved) {
    return (
      <ChakraBox
        className={className}
        style={style}
        borderWidth={1}
        borderRadius={4}
      >
        {children}
      </ChakraBox>
    );
  }

  return (
    <div className={className ? `${classes.box} ${className}` : classes.box} style={style}>
      {children}
    </div>
  );
}
