import { Container as ChakraContainer } from '@chakra-ui/react';

import { isChakraRemoved } from '../constant';

import classes from './container.module.css';

type ContainerProps = {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/**
 *
 * Layout component used to wrap app or website content
 *
 * It sets margin-left and margin-right to auto, to keep its content centered.
 * It also sets a default max-width of 60ch (60 characters).
 */

export function Container({ children, className, style }: ContainerProps) {
  if (isChakraRemoved) {
    return (
      <div
        className={className ? `${classes.container} ${className}` : classes.container}
        style={style}
      >
        {children}
      </div>
    );
  }

  return (
    <ChakraContainer
      className={className}
      style={style}
    >
      {children}
    </ChakraContainer>
  );
}
