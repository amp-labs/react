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

import { BasicAuthCardLayout } from 'components/BasicAuth/BasicAuthCardLayout';
import { BasicAuthErrorAlert } from 'components/BasicAuth/BasicAuthErrorAlert';
import { DocsHelperText } from 'components/Docs/DocsHelperText';
import { getProviderName } from 'src/utils';

type LandingContentProps = {
  provider: string;
  providerInfo: ProviderInfo;
  handleSubmit: (user: string, pass: string) => void;
  error: string | null;
  isButtonDisabled?: boolean;
};

export function LandingContent({
  provider, providerInfo, handleSubmit, error, isButtonDisabled,
}: LandingContentProps) {
  const [show, setShow] = useState(false);
  const onToggleShowHide = () => setShow(!show);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event: React.FormEvent<HTMLInputElement>) => setUsername(event.currentTarget.value);
  const handlePasswordChange = (event: React.FormEvent<HTMLInputElement>) => setPassword(event.currentTarget.value);

  const providerName = getProviderName(provider, providerInfo);
  const docsURL = providerInfo.basicOpts?.docsURL;
  const isUserValid = username.length > 0;
  const isSubmitDisabled = isButtonDisabled || !isUserValid;
  // This is a workaround for the fact that some providers use Basic Auth
  // to actually represent API key based auth.
  // TODO(ENG-1424): Uncomment the following line when we handle this properly.
  // const isPassValid = password.length > 0;
  // const isSubmitDisabled = isButtonDisabled || !isUserValid || !isPassValid;

  return (
    <BasicAuthCardLayout>
      <FormControl>
        <FormLabel marginTop="16" marginBottom="0">
          <Heading as="h4" size="md">{`Set up ${providerName} integration`}</Heading>
        </FormLabel>
        <BasicAuthErrorAlert error={error} />
        <br />

        <Stack spacing={4}>
          {docsURL && (
            <DocsHelperText
              url={docsURL}
              providerDisplayName={providerName}
              credentialName="credentials"
            />
          )}

          <Input placeholder="Username" onChange={handleUsernameChange} />
          <InputGroup size="md">
            <Input
              onChange={handlePasswordChange}
              pr="4.5rem"
              type={show ? 'text' : 'password'}
              placeholder="Password"
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
            handleSubmit(username, password);
          }}
        >
          Next
        </Button>
      </FormControl>
    </BasicAuthCardLayout>
  );
}
