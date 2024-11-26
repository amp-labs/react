import { AuthErrorAlert } from 'components/auth/AuthErrorAlert/AuthErrorAlert';
import { FormComponent } from 'components/form';
import { Button } from 'components/ui-base/Button';
import { AuthCardLayout, AuthTitle } from 'src/layout/AuthCardLayout/AuthCardLayout';

import { WorkspaceEntryProps } from './WorkspaceEntryProps';

/**
   *
   * @param param0
   * @returns
   */
export function WorkspaceEntryContent({
  handleSubmit, setWorkspace, error, isButtonDisabled, providerName,
}: WorkspaceEntryProps) {
  return (
    <AuthCardLayout>
      <AuthTitle>Enter your {providerName} workspace</AuthTitle>
      <AuthErrorAlert error={error} />
      <br />
      <FormComponent.Input
        id="workspace"
        type="text"
        placeholder="MyWorkspace"
        onChange={(event) => setWorkspace(event.currentTarget.value)}
      />
      <br />
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
