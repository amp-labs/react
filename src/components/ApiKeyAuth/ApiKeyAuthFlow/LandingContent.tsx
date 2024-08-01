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

import { ApiKeyAuthCardLayout } from 'components/ApiKeyAuth/ApiKeyAuthCardLayout';
import { ApiKeyAuthErrorAlert } from 'components/ApiKeyAuth/ApiKeyAuthErrorAlert';
import { capitalize } from 'src/utils';

type LandingContentProps = {
  provider: string;
  handleSubmit: (value: string) => void;
  error: string | null;
  isButtonDisabled?: boolean;
};

export function LandingContent({
  provider, handleSubmit, error, isButtonDisabled,
}: LandingContentProps) {
  const [show, setShow] = useState(false);
  const onToggleShowHide = () => setShow(!show);
  const [apiKey, setApiKey] = useState('');
  const handlePasswordChange = (event: React.FormEvent<HTMLInputElement>) => setApiKey(event.currentTarget.value);

  const apiKeyValid = apiKey.length > 0;
  const isSubmitDisabled = isButtonDisabled || !apiKeyValid;

  return (
    <ApiKeyAuthCardLayout>
      <FormControl>
        <FormLabel marginTop="16" marginBottom="0">
          <Heading as="h4" size="md">{`Set up ${capitalize(provider)} integration`}</Heading>
        </FormLabel>
        <ApiKeyAuthErrorAlert error={error} />
        <br />

        <Stack spacing={4}>
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
    </ApiKeyAuthCardLayout>
  );
}
