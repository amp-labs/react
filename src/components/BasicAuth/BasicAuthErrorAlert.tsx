import { Alert, AlertDescription, AlertIcon } from '@chakra-ui/react';

interface BasicAuthErrorAlertProps {
  error: string | null;
}
export function BasicAuthErrorAlert({ error }: BasicAuthErrorAlertProps) {
  if (error) {
    return (
      <Alert status="error" marginTop="2em">
        <AlertIcon />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return null;
}
