import { ErrorIcon } from 'assets/ErrorIcon';

import { Box } from '../ui-base/Box/Box';
import { Container } from '../ui-base/Container/Container';

import classes from './errorTextBox.module.css';

interface ErrorTextBoxProps {
  message: string,
}

export function ErrorTextBox({ message }: ErrorTextBoxProps) {
  return (
    <Container className={classes.errorBoxContainer}>
      <ErrorIcon />
      <Box className={classes.errorBox}>
        <p className={classes.errorText}>{message}</p>
      </Box>
    </Container>
  );
}
