import { useState } from 'react';
import { ProviderInfo } from '@generated/api/src';
import { AuthErrorAlert } from 'src/components/auth/AuthErrorAlert/AuthErrorAlert';
import { FormComponent } from 'src/components/form';
import { Button } from 'src/components/ui-base/Button';
import { useProvider } from 'src/hooks/useProvider';
import { AuthCardLayout, AuthTitle } from 'src/layout/AuthCardLayout/AuthCardLayout';
import { capitalize } from 'src/utils';

import { DocsHelperText } from 'components/Docs/DocsHelperText';

import { IFormType, LandingContentProps } from './LandingContentProps';

type ApiKeyAuthFormProps = {
  provider: string;
  providerInfo: ProviderInfo;
  handleSubmit: (form: IFormType) => void;
  isButtonDisabled?: boolean;
  buttonVariant?: 'ghost';
  submitButtonType?: 'submit' | 'button';
};

export function ApiKeyAuthForm({
  provider, providerInfo, handleSubmit, isButtonDisabled, buttonVariant, submitButtonType,
}: ApiKeyAuthFormProps) {
  const [show, setShow] = useState(false);
  const onToggleShowHide = () => setShow((prevShow) => !prevShow);
  const [apiKey, setApiKey] = useState('');
  const handlePasswordChange = (event: React.FormEvent<HTMLInputElement>) => setApiKey(event.currentTarget.value);
  const { providerName } = useProvider(provider);

  const isApiKeyValid = apiKey.length > 0;
  const isSubmitDisabled = isButtonDisabled || !isApiKeyValid;
  const docsURL = providerInfo.apiKeyOpts?.docsURL;

  return (
    <div style={{
      display: 'flex', gap: '1rem', flexDirection: 'column', marginTop: '1rem',
    }}
    >
      {docsURL && (
      <DocsHelperText
        url={docsURL}
        providerDisplayName={providerName || capitalize(provider)}
        credentialName="API key"
      />
      )}
      <div style={{ display: 'flex', gap: '.5rem' }}>
        <FormComponent.Input
          id="password"
          name="password"
          type={show ? 'text' : 'password'}
          placeholder="API Key"
          onChange={(event) => handlePasswordChange(event)}
        />
        <Button
          type="button"
          style={{ height: '2.5rem', width: '5rem' }}
          onClick={onToggleShowHide}
          variant={buttonVariant}
        >
          {show ? 'Hide' : 'Show'}
        </Button>
      </div>
      <Button
        style={{ marginTop: '1em', width: '100%' }}
        disabled={isSubmitDisabled}
        type={submitButtonType || 'submit'}
        onClick={() => handleSubmit({ apiKey })}
        variant={buttonVariant}
      >
        Next
      </Button>
    </div>
  );
}

function ApiKeyAuthContentForm({
  provider, providerInfo, handleSubmit, error, isButtonDisabled,
}: LandingContentProps) {
  const { providerName } = useProvider(provider);

  return (
    <AuthCardLayout>
      <AuthTitle>{`Set up ${providerName} integration`}</AuthTitle>
      <AuthErrorAlert error={error} />
      <ApiKeyAuthForm
        provider={provider}
        providerInfo={providerInfo}
        handleSubmit={handleSubmit}
        isButtonDisabled={isButtonDisabled}
      />
    </AuthCardLayout>
  );
}

/**
 * bridge for Chakra UI / native form
 * @param param0
 * @returns
 */
export function ApiKeyAuthContent({ ...props }: LandingContentProps) {
  return (
    <ApiKeyAuthContentForm {...props} />
  );
}
