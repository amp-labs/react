import { useCallback, useState } from 'react';

import { AuthErrorAlert } from 'src/components/auth/AuthErrorAlert/AuthErrorAlert';
import { OAuthWindow } from 'src/components/auth/Oauth/AuthorizationCode/OAuthWindow/OAuthWindow';
import { FormSuccessBox } from 'src/components/FormSuccessBox';
import { Button } from 'src/components/ui-base/Button';
import { useConnections } from 'src/context/ConnectionsContextProvider';
import { useUpdateOauthConnectMutation } from 'src/hooks/mutation/useUpdateOauthConnectMutation';
import { useProvider } from 'src/hooks/useProvider';
import { handleServerError } from 'src/utils/handleServerError';

import { FieldHeader } from '../../fields/FieldHeader';

export function UpdateContent({
  handleSubmit, error, isButtonDisabled, providerName,
}: {
  handleSubmit: () => void;
  error: string | null;
  isButtonDisabled: boolean;
  providerName: string | undefined;
}) {
  return (
    <div style={{ padding: '1rem 0' }}>
      <p>{`Re-authenticate to ${providerName}`}</p>
      <AuthErrorAlert error={error} />
      <Button
        variant="ghost"
        style={{ marginTop: '1em', width: '100%' }}
        disabled={isButtonDisabled}
        type="submit"
        onClick={handleSubmit}
      >
        Next
      </Button>
    </div>
  );
}

export function UpdateOauthConnect() {
  const { selectedConnection, isConnectionsLoading } = useConnections();

  const connectionId = selectedConnection?.id;
  const projectIdOrName = selectedConnection?.projectId;
  const { providerName } = useProvider();
  const {
    mutateAsync: updateOauthConnect, isPending: isUpdatingOauthConnect, error: updateOauthConnectError,
  } = useUpdateOauthConnectMutation();

  const [localError, setError] = useState<string | null>(null);
  const [successConnect, setSuccessConnect] = useState<boolean>(false);
  const [url, setUrl] = useState<string | null>(null);

  const resetSuccessConnect = () => {
    setSuccessConnect(false);
  };

  const handleSuccessConnect = () => {
    setSuccessConnect(true);
    setError(null);
    setUrl(null);
  };

  const error = updateOauthConnectError?.message || localError || null;
  const handleSubmit = async () => {
    resetSuccessConnect();
    setError(null);

    try {
      const oauthUrl = await updateOauthConnect({
        projectIdOrName: projectIdOrName || '',
        connectionId: connectionId || '',
      });

      setUrl(oauthUrl);
    } catch (e) {
      handleServerError(e, setError);
    }
  };

  const onError = useCallback((err: string | null) => {
    setError(err);
  }, []);

  return (
    <>
      <FieldHeader string="Update Connection" />
      {successConnect && <FormSuccessBox>Connection updated successfully</FormSuccessBox>}
      <OAuthWindow
        windowTitle={`Connect to ${providerName}`}
        oauthUrl={url || null}
        onError={onError}
        error={error}
        isSuccessConnect={successConnect}
        onSuccessConnect={handleSuccessConnect}
      >
        <UpdateContent
          handleSubmit={handleSubmit}
          error={error}
          providerName={providerName}
          isButtonDisabled={isUpdatingOauthConnect || isConnectionsLoading || successConnect}
        />
      </OAuthWindow>
    </>
  );
}
