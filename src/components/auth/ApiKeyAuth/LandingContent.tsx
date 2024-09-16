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
import { ProviderInfo } from '@generated/api/src';

import { DocsHelperText } from 'components/Docs/DocsHelperText';
import { AuthErrorAlert } from 'src/components/auth/AuthErrorAlert/AuthErrorAlert';
import { AuthCardLayout } from 'src/layout/AuthCardLayout/AuthCardLayout';
import { getProviderName } from 'src/utils';

type LandingContentProps = {
  provider: string;
  providerInfo: ProviderInfo;
  handleSubmit: (value: string) => void;
  error: string | null;
  isButtonDisabled?: boolean;
};

export function LandingContent({
  provider, providerInfo, handleSubmit, error, isButtonDisabled,
}: LandingContentProps) {
  const [show, setShow] = useState(false);
  const onToggleShowHide = () => setShow(!show);
  const [apiKey, setApiKey] = useState('');
  const handlePasswordChange = (event: React.FormEvent<HTMLInputElement>) => setApiKey(event.currentTarget.value);

  const isApiKeyValid = apiKey.length > 0;
  const isSubmitDisabled = isButtonDisabled || !isApiKeyValid;
  const providerName = getProviderName(provider, providerInfo);
  const docsURL = providerInfo.apiKeyOpts?.docsURL;

  return (
    <AuthCardLayout>
      <FormControl>
        <FormLabel my="6">
          <Heading as="h4" size="md">{`Set up ${providerName} integration`}</Heading>
        </FormLabel>
        <AuthErrorAlert error={error} />

        <Stack spacing={4}>
          {docsURL && (
            <DocsHelperText
              url={docsURL}
              providerDisplayName={providerName}
              credentialName="API key"
            />
          )}

          <InputGroup size="md">
            <Input
              onChange={handlePasswordChange}
              pr="4.5rem"
              type={show ? 'text' : 'password'}
              placeholder="API Key"
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
          variant="primary"
          isDisabled={isSubmitDisabled}
          width="100%"
          type="submit"
          onClick={() => {
            handleSubmit(apiKey);
          }}
        >
          Next
        </Button>
      </FormControl>
    </AuthCardLayout>
  );
}
