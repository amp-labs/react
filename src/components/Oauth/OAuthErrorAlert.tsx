import { Alert, AlertDescription, AlertIcon } from '@chakra-ui/react';

interface OAuthErrorAlertProps {
  error: string | null;
}
export function OAuthErrorAlert({ error }: OAuthErrorAlertProps) {
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
