import { FormErrorBox } from 'src/components/FormErrorBox';

interface OAuthErrorAlertProps {
  error: string | null;
}

export function AuthErrorAlert({ error }: OAuthErrorAlertProps) {
  if (error) {
    return <FormErrorBox style={{ marginTop: '2em' }}>{error}</FormErrorBox>;
  }

  return null;
}
