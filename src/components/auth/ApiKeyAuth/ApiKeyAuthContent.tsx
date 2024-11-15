import { useState } from 'react';

import { AuthCardLayoutTemplate } from 'components/auth/AuthCardLayoutTemplate';
import { DocsHelperText } from 'components/Docs/DocsHelperText';
import { FormComponent } from 'src/components/form';
import { Button } from 'src/components/ui-base/Button';
import { getProviderName } from 'src/utils';

import { LandingContentProps } from './LandingContentProps';

function ApiKeyAuthContentForm({
  provider, providerInfo, handleSubmit, error, isButtonDisabled,
}: LandingContentProps) {
  const [show, setShow] = useState(false);
  const onToggleShowHide = () => setShow((prevShow) => !prevShow);
  const [apiKey, setApiKey] = useState('');
  const handlePasswordChange = (event: React.FormEvent<HTMLInputElement>) => setApiKey(event.currentTarget.value);

  const isApiKeyValid = apiKey.length > 0;
  const isSubmitDisabled = isButtonDisabled || !isApiKeyValid;
  const providerName = getProviderName(provider, providerInfo);
  const docsURL = providerInfo.apiKeyOpts?.docsURL;

  return (
    <AuthCardLayoutTemplate
      providerName={providerName}
      handleSubmit={() => { handleSubmit({ apiKey }); }}
      error={error}
      isButtonDisabled={isSubmitDisabled}
    >
      <div style={{
        display: 'flex', gap: '1rem', flexDirection: 'column', marginTop: '1rem',
      }}
      >
        {docsURL && (
        <DocsHelperText
          url={docsURL}
          providerDisplayName={providerName}
          credentialName="API key"
        />
        )}
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <FormComponent.Input
            id="password"
            name="password"
            type={show ? 'text' : 'password'}
            placeholder="Password"
            onChange={(event) => handlePasswordChange(event)}
          />
          <Button
            type="button"
            style={{ height: '2.5rem', width: '5rem' }}
            onClick={onToggleShowHide}
          >
            {show ? 'Hide' : 'Show'}
          </Button>
        </div>
      </div>
    </AuthCardLayoutTemplate>
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
