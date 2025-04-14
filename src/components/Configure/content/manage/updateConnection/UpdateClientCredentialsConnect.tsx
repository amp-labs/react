import { useState } from 'react';

import { ClientCredentialsContent } from 'src/components/auth/Oauth/ClientCredentials/ClientCredentialsContent';
import { ClientCredentialsCredsContent } from 'src/components/auth/Oauth/ClientCredentials/ClientCredentialsCredsContent';
import { FormSuccessBox } from 'src/components/FormSuccessBox';
import { useConnections } from 'src/context/ConnectionsContextProvider';
import { useProject } from 'src/context/ProjectContextProvider';
import { useUpdateConnectionMutation } from 'src/hooks/mutation/useUpdateConnectionMutation';
import { useProvider } from 'src/hooks/useProvider';
import { handleServerError } from 'src/utils/handleServerError';

import { FieldHeader } from '../../fields/FieldHeader';

export function UpdateClientCredentialsConnect() {
  const { projectIdOrName } = useProject();
  const { selectedConnection, isConnectionsLoading } = useConnections();
  const { providerName, data: providerInfo } = useProvider();
  const {
    mutateAsync: updateConnection, isPending: isConnectionUpdating, error: updateError,
  } = useUpdateConnectionMutation();

  const [localError, setError] = useState<string | null>(null);
  const [successConnect, setSuccessConnect] = useState<boolean>(false);

  const resetSuccessConnect = () => {
    setSuccessConnect(false);
  };

  const handleSuccessConnect = () => {
    setSuccessConnect(true);
    setError(null);
  };

  const explicitScopesRequired = providerInfo?.oauth2Opts?.explicitScopesRequired;
  const error = updateError?.message || localError || null;
  const handleSubmit = async (formData: ClientCredentialsCredsContent) => {
    resetSuccessConnect();
    setError(null);

    try {
      await updateConnection({
        projectIdOrName: projectIdOrName || '',
        connectionId: selectedConnection?.id || '',
        updateConnectionRequest: {
          oauth2ClientCredentials: {
            clientId: formData.clientId,
            clientSecret: formData.clientSecret,
            scopes: formData.scopes,
          },
        },
      });
      handleSuccessConnect();
    } catch (e) {
      handleServerError(e, setError);
    }
  };

  return (
    <>
      <FieldHeader string="Update Connection" />
      {successConnect && <FormSuccessBox>Connection updated successfully</FormSuccessBox>}
      <ClientCredentialsContent
        handleSubmit={handleSubmit}
        error={error}
        isButtonDisabled={isConnectionUpdating || isConnectionsLoading}
        providerName={providerName}
        explicitScopesRequired={explicitScopesRequired} // todo: add scopes to update connection
        explicitWorkspaceRequired={false} // workspace is not updated so do not show
      />
    </>
  );
}
