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

import { AuthErrorAlert } from 'src/components/auth/AuthErrorAlert/AuthErrorAlert';
import { AuthCardLayout } from 'src/layout/AuthCardLayout/AuthCardLayout';
import { convertTextareaToArray } from 'src/utils';

export type WorkspaceClientCredentialsCreds = {
  workspace: string;
  clientId: string;
  clientSecret: string;
  scopes?: string[];
};

type LandingContentProps = {
  handleSubmit: (creds: WorkspaceClientCredentialsCreds) => void;
  error: string | null;
  explicitScopesRequired?: boolean;
  isButtonDisabled?: boolean;
  providerName?: string;
};

/**
 * @deprecated remove after removing chakra
 * @param param0
 * @returns
 */
export function WorkspaceClientCredentialsContent({
  handleSubmit, error, isButtonDisabled, providerName,
  explicitScopesRequired,
}: LandingContentProps) {
  const [show, setShow] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [clientId, setClientId] = useState('');
  const [workspace, setWorkspace] = useState('');
  const [scopes, setScopes] = useState('');

  const onToggleShowHide = () => setShow(!show);
  const handleClientSecretChange = (event: React.FormEvent<HTMLInputElement>) => setClientSecret(event.currentTarget.value);
  const handleClientIdChange = (event: React.FormEvent<HTMLInputElement>) => setClientId(event.currentTarget.value);
  const handleWorkspaceChange = (event: React.FormEvent<HTMLInputElement>) => setWorkspace(event.currentTarget.value);
  const handleScopesChange = (event: React.FormEvent<HTMLTextAreaElement>) => setScopes(event.currentTarget.value);

  const isClientSecretValid = clientSecret.length > 0;
  const isClientIdValid = clientId.length > 0;
  const isWorkspaceValid = workspace.length > 0;
  const isSubmitDisabled = isButtonDisabled || !isClientSecretValid || !isClientIdValid || !isWorkspaceValid;

  const onHandleSubmit = () => {
    const req: WorkspaceClientCredentialsCreds = {
      workspace,
      clientId,
      clientSecret,
    };

    if (explicitScopesRequired && scopes.length > 0) {
      req.scopes = convertTextareaToArray(scopes);
    }

    handleSubmit(req);
  };

  return (
    <AuthCardLayout>
      <FormControl>
        <FormLabel marginTop="16" marginBottom="0">
          <Heading as="h4" size="md">{`Set up ${providerName} integration`}</Heading>
        </FormLabel>
        <AuthErrorAlert error={error} />
        <br />

        <Stack spacing={4}>
          <Input
            placeholder="MyWorkspace"
            onChange={handleWorkspaceChange}
          />
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
    </AuthCardLayout>
  );
}
