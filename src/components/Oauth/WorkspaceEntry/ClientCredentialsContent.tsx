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
} from '@chakra-ui/react';

import { OauthCardLayout } from 'components/Oauth/OauthCardLayout';
import { OAuthErrorAlert } from 'components/Oauth/OAuthErrorAlert';
import { capitalize } from 'src/utils';

export type WorkspaceClientCredentialsCreds = {
  workspace: string;
  clientId: string;
  clientSecret: string;
};

type LandingContentProps = {
  provider: string;
  handleSubmit: (creds: WorkspaceClientCredentialsCreds) => void;
  error: string | null;
  isButtonDisabled?: boolean;
};

export function ClientCredentialsContent({
  provider, handleSubmit, error, isButtonDisabled,
}: LandingContentProps) {
  const [show, setShow] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [clientId, setClientId] = useState('');
  const [workspace, setWorkspace] = useState('');

  const onToggleShowHide = () => setShow(!show);
  const handleClientSecretChange = (event: React.FormEvent<HTMLInputElement>) => setClientSecret(event.currentTarget.value);
  const handleClientIdChange = (event: React.FormEvent<HTMLInputElement>) => setClientId(event.currentTarget.value);
  const handleWorkspaceChange = (event: React.FormEvent<HTMLInputElement>) => setWorkspace(event.currentTarget.value);

  const clientSecretValid = clientSecret.length > 0;
  const clientIdValid = clientId.length > 0;
  const workspaceValid = workspace.length > 0;

  return (
    <OauthCardLayout>
      <FormControl>
        <FormLabel marginTop="16" marginBottom="0">
          <Heading as="h4" size="md">{`Set up ${capitalize(provider)} integration`}</Heading>
        </FormLabel>
        <OAuthErrorAlert error={error} />
        <br />

        <Stack spacing={4}>
          <Input
            isInvalid={!workspaceValid}
            placeholder="MyWorkspace"
            onChange={handleWorkspaceChange}
          />
          <Input isInvalid={!clientIdValid} placeholder="Client ID" onChange={handleClientIdChange} />
          <InputGroup size="md">
            <Input
              isInvalid={!clientSecretValid}
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
        </Stack>

        <br />

        <Button
          isDisabled={!workspaceValid || !clientIdValid || !clientSecretValid || isButtonDisabled}
          width="100%"
          type="submit"
          onClick={() => {
            handleSubmit({ workspace, clientId, clientSecret });
          }}
        >
          Next
        </Button>
      </FormControl>
    </OauthCardLayout>
  );
}
