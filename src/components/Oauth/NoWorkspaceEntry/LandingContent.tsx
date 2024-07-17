import {
  Button, FormControl, FormLabel, Heading,
} from '@chakra-ui/react';

import { capitalize } from 'src/utils';

import { OauthCardLayout } from '../OauthCardLayout';
import { OAuthErrorAlert } from '../OAuthErrorAlert';

type LandingContentProps = {
  provider: string;
  handleSubmit: () => void;
  error: string | null;
  isButtonDisabled?: boolean;
};

export function LandingContent({
  provider, handleSubmit, error, isButtonDisabled,
}: LandingContentProps) {
  return (
    <OauthCardLayout>
      <FormControl>
        <FormLabel marginTop="16" marginBottom="0">
          <Heading as="h4" size="md">{`Set up ${capitalize(provider)} integration`}</Heading>
        </FormLabel>
        <OAuthErrorAlert error={error} />
        <br />
        <Button
          isDisabled={isButtonDisabled}
          width="100%"
          type="submit"
          onClick={handleSubmit}
        >
          Next
        </Button>
      </FormControl>
    </OauthCardLayout>
  );
}
