import { ErrorIcon } from 'assets/ErrorIcon';

import { Box } from '../ui-base/Box/Box';
import { Container } from '../ui-base/Container/Container';

import classes from './errorTextBox.module.css';

interface ErrorTextBoxProps {
  message: string,
  children?: React.ReactNode
}

export function InnerErrorTextBox({ message }: { message: string }) {
  return (
    <Box className={classes.errorBox}>
      <p className={classes.errorText}>{message}</p>
    </Box>
  );
}

export function ErrorTextBox({ message, children }: ErrorTextBoxProps) {
  return (
    <Container className={classes.errorBoxContainer}>
      <ErrorIcon />
      <InnerErrorTextBox message={message} />
      {children}
    </Container>
  );
}
