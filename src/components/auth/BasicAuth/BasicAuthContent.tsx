import { useState } from 'react';

import { AuthCardLayoutTemplate } from 'components/auth/AuthCardLayoutTemplate';
import { DocsHelperText } from 'components/Docs/DocsHelperText';
import { FormComponent } from 'src/components/form';
import { Button } from 'src/components/ui-base/Button';
import { isChakraRemoved } from 'src/components/ui-base/constant';
import { getProviderName } from 'src/utils';

import { ChakraLandingContent } from './ChakraLandingContent';
import { LandingContentProps } from './LandingContentProps';

function BasicAuthContentForm({
  provider, providerInfo, handleSubmit, error, isButtonDisabled,
}: LandingContentProps) {
  const [show, setShow] = useState(false);
  const onToggleShowHide = () => setShow((prevShow) => !prevShow);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { username, password } = formData;

  const providerName = getProviderName(provider, providerInfo);
  const docsURL = providerInfo.basicOpts?.docsURL;
  const isUserValid = username.length > 0;
  const isSubmitDisabled = isButtonDisabled || !isUserValid;

  // This is a workaround for the fact that some providers use Basic Auth
  // to actually represent API key based auth.
  // TODO(ENG-1424): Uncomment the following line when we handle this properly.
  // const isPassValid = password.length > 0;
  // const isSubmitDisabled = isButtonDisabled || !isUserValid || !isPassValid;

  const handleChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <AuthCardLayoutTemplate
      providerName={providerName}
      handleSubmit={() => { handleSubmit({ username, password }); }}
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
          credentialName="credentials"
        />
        )}
        <FormComponent.Input
          id="username"
          name="username"
          type="text"
          placeholder="Username"
          onChange={(event) => handleChange(event)}
        />
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <FormComponent.Input
            id="password"
            name="password"
            type={show ? 'text' : 'password'}
            placeholder="Password"
            onChange={(event) => handleChange(event)}
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
export function BasicAuthContent({ ...props }: LandingContentProps) {
  if (!isChakraRemoved) {
    return <ChakraLandingContent {...props} />;
  }

  return (
    <BasicAuthContentForm {...props} />
  );
}
