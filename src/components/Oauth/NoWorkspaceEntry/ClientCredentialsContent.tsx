import { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Textarea,
} from '@chakra-ui/react';

import { OauthCardLayout } from 'components/Oauth/OauthCardLayout';
import { OAuthErrorAlert } from 'components/Oauth/OAuthErrorAlert';
import { convertTextareaToArray } from 'src/utils';

export type ClientCredentialsCreds = {
  clientId: string;
  clientSecret: string;
  scopes?: string[];
};

type LandingContentProps = {
  handleSubmit: (creds: ClientCredentialsCreds) => void;
  error: string | null;
  explicitScopesRequired?: boolean;
  isButtonDisabled?: boolean;
  providerName?: string;
};

export function ClientCredentialsContent({
  handleSubmit, error, explicitScopesRequired, isButtonDisabled, providerName,
}: LandingContentProps) {
  const [show, setShow] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [clientId, setClientId] = useState('');
  const [scopes, setScopes] = useState('');

  const onToggleShowHide = () => setShow(!show);

  const handleClientSecretChange = (event: React.FormEvent<HTMLInputElement>) => setClientSecret(event.currentTarget.value);
  const handleClientIdChange = (event: React.FormEvent<HTMLInputElement>) => setClientId(event.currentTarget.value);
  const handleScopesChange = (event: React.FormEvent<HTMLTextAreaElement>) => setScopes(event.currentTarget.value);

  const isClientSecretValid = clientSecret.length > 0;
  const isClientIdValid = clientId.length > 0;
  const isSubmitDisabled = isButtonDisabled || !isClientSecretValid || !isClientIdValid;

  const onHandleSubmit = () => {
    const req: ClientCredentialsCreds = {
      clientId,
      clientSecret,
    };

    if (explicitScopesRequired && scopes.length > 0) {
      req.scopes = convertTextareaToArray(scopes);
    }

    handleSubmit(req);
  };

  return (
    <OauthCardLayout>
      <FormControl>
        <FormLabel marginTop="16" marginBottom="0">
          <Heading as="h4" size="md">{`Set up ${providerName} integration`}</Heading>
        </FormLabel>
        <OAuthErrorAlert error={error} />
        <br />

        <Stack spacing={4}>
          <Input placeholder="Client ID" onChange={handleClientIdChange} />
          <InputGroup size="md">
            <Input
              onChange={handleClientSecretChange}
              pr="4.5rem"
              type={show ? 'text' : 'password'}
              placeholder="Client Secret"
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={onToggleShowHide}>
                {show ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
          {explicitScopesRequired && (
            <Textarea
              placeholder="Scopes separated by new line"
              onChange={handleScopesChange}
            />
          )}
        </Stack>
        <br />

        <Button
          variant="primary"
          isDisabled={isSubmitDisabled}
          width="100%"
          type="submit"
          onClick={onHandleSubmit}
        >
          Next
        </Button>
      </FormControl>
    </OauthCardLayout>
  );
}
