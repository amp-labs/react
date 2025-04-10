import { useCallback, useEffect, useState } from 'react';

import { AuthErrorAlert } from 'src/components/auth/AuthErrorAlert/AuthErrorAlert';
import { OAuthWindow } from 'src/components/auth/Oauth/AuthorizationCode/OAuthWindow/OAuthWindow';
import { Button } from 'src/components/ui-base/Button';
import { useConnections } from 'src/context/ConnectionsContextProvider';
import { useUpdateOauthConnectQuery } from 'src/hooks/query/useUpdateOauthConnectMutation';
import { useProvider } from 'src/hooks/useProvider';
import { handleServerError } from 'src/utils/handleServerError';

import { FieldHeader } from '../fields/FieldHeader';

function UpdateContent({
  handleSubmit, error, isButtonDisabled, providerName,
}: {
  handleSubmit: () => void;
  error: string | null;
  isButtonDisabled: boolean;
  providerName: string | undefined;
}) {
  return (
    <div style={{ padding: '1rem 0' }}>
      <p>
        {`Set up ${providerName} integration you'd like to sync.`}
      </p>
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

export function UpdateConnectionSection() {
  const { selectedConnection, isConnectionsLoading } = useConnections();

  const connectionId = selectedConnection?.id;
  const projectIdOrName = selectedConnection?.projectId;
  const { providerName } = useProvider();

  // consider reusing no workspace oauth flow
  const {
    data: oAuthPopupURL, error: oAuthConnectError, isFetching, refetch: refetchOauthConnect,
  } = useUpdateOauthConnectQuery({
    projectIdOrName: projectIdOrName || '',
    connectionId: connectionId || '',
  });

  // note move to query hook
  useEffect(() => {
    if (oAuthConnectError) {
      handleServerError(oAuthConnectError);
    }
  }, [oAuthConnectError]);

  const [localError, setError] = useState<string | null>(null);
  const [successConnect, setSuccessConnect] = useState<boolean>(false);

  const resetSuccessConnect = () => {
    setSuccessConnect(false);
  };

  const handleSuccessConnect = () => {
    setSuccessConnect(true);
  };

  const error = oAuthConnectError?.message || localError || null;
  const handleSubmit = async () => {
    resetSuccessConnect();
    setError(null);
    await refetchOauthConnect();
  };

  const onError = useCallback((err: string | null) => {
    setError(err);
  }, []);

  return (
    <>
      <FieldHeader string="Update Connection" />
      <OAuthWindow
        windowTitle={`Connect to ${providerName}`}
        oauthUrl={oAuthPopupURL || null}
        onError={onError}
        error={error}
        isSuccessConnect={successConnect}
        onSuccessConnect={handleSuccessConnect}
      >
        <UpdateContent
          handleSubmit={handleSubmit}
          error={error}
          providerName={providerName}
          isButtonDisabled={isFetching || isConnectionsLoading}
        />
      </OAuthWindow>
    </>
  );
}
