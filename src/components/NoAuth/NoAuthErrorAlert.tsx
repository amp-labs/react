import { Alert, AlertDescription, AlertIcon } from '@chakra-ui/react';

interface NoAuthErrorAlertProps {
  error: string | null;
}
export function NoAuthErrorAlert({ error }: NoAuthErrorAlertProps) {
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
