import { Box as ChakraBox, Text } from '@chakra-ui/react';

import { ErrorIcon } from 'assets/ErrorIcon';

import { Box } from '../ui-base/Box/Box';
import { isChakraRemoved } from '../ui-base/constant';
import { Container } from '../ui-base/Container/Container';

import classes from './errorTextBox.module.css';

interface ErrorTextBoxProps {
  message: string,
}

export function ErrorTextBox({ message }: ErrorTextBoxProps) {
  if (isChakraRemoved) {
    return (
      <Container className={classes.errorBoxContainer}>
        <ErrorIcon />
        <Box className={classes.errorBox}>
          <p className={classes.errorText}>{message}</p>
        </Box>
      </Container>
    );
  }

  return (
    <ChakraBox
      minHeight="300px"
      padding="30px"
      display="flex"
      flexDirection="column"
      justifyContent="space-evenly"
      alignItems="center"
    >
      <ErrorIcon />
      <ChakraBox
        boxSizing="border-box"
        display="flex"
        justifyContent="center"
        alignItems="center"
        align-self="stretch"
        padding="12px 50px 12px 50px"
        borderRadius="8px"
        border="2px solid #FECACA"
        background="#FEF2F2"
      >
        <Text color="#991B1B" fontSize="md">
          {message}
        </Text>
      </ChakraBox>
    </ChakraBox>
  );
}
