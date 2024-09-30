import { AuthErrorAlert } from 'components/auth/AuthErrorAlert/AuthErrorAlert';
import { Button } from 'components/ui-base/Button';
import { isChakraRemoved } from 'src/components/ui-base/constant';
import { AuthCardLayout, AuthTitle } from 'src/layout/AuthCardLayout/AuthCardLayout';

import { ChakraLandingContent } from './LandingContent';
import { LandingContentProps } from './LandingContentProps';

export function NoWorkspaceEntryContent({
  handleSubmit, error, isButtonDisabled, providerName,
}: LandingContentProps) {
  if (!isChakraRemoved) {
    return (
      <ChakraLandingContent
        handleSubmit={handleSubmit}
        error={error}
        isButtonDisabled={isButtonDisabled}
        providerName={providerName}
      />
    );
  }

  return (
    <AuthCardLayout>
      <AuthTitle>{`Set up ${providerName} integration`}</AuthTitle>
      <AuthErrorAlert error={error} />
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
