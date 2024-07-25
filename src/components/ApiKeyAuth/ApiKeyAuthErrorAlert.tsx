import { Alert, AlertDescription, AlertIcon } from '@chakra-ui/react';

interface ApiKeyAuthErrorAlertProps {
  error: string | null;
}
export function ApiKeyAuthErrorAlert({ error }: ApiKeyAuthErrorAlertProps) {
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
