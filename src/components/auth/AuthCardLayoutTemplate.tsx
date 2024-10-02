import { Button } from 'src/components/ui-base/Button';
import { AuthCardLayout, AuthTitle } from 'src/layout/AuthCardLayout/AuthCardLayout';

import { AuthErrorAlert } from './AuthErrorAlert/AuthErrorAlert';

type AuthCardLayoutTemplateProps = {
  handleSubmit: (creds: any) => void;
  error: string | null;
  isButtonDisabled?: boolean;
  providerName?: string;
  title?: string;
  children?: React.ReactNode;
};

/**
 * Template that assembles AuthCardLayout, AuthTitle, AuthErrorAlert, a Button
 * with option to pass children and title
 * @param param0
 * @returns
 */
export function AuthCardLayoutTemplate({
  handleSubmit, error, isButtonDisabled, providerName, children, title,
}: AuthCardLayoutTemplateProps) {
  if (!title && !providerName) {
    throw new Error('Either title or providerName is required');
  }

  return (
    <AuthCardLayout>
      <AuthTitle>{title || `Set up ${providerName} integration`}</AuthTitle>
      <AuthErrorAlert error={error} />
      {children}
      <Button
        style={{ marginTop: '1em', width: '100%' }}
        disabled={isButtonDisabled}
        type="submit"
        onClick={handleSubmit}
      >
        Next
      </Button>
    </AuthCardLayout>
  );
}
