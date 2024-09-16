import { Alert, AlertDescription, AlertIcon } from '@chakra-ui/react';

interface OAuthErrorAlertProps {
  error: string | null;
}
export function AuthErrorAlert({ error }: OAuthErrorAlertProps) {
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
