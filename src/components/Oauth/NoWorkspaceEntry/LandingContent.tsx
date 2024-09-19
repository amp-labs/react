import {
  Button, FormControl, FormLabel, Heading,
} from '@chakra-ui/react';

import { AuthCardLayout } from 'src/layout/AuthCardLayout/AuthCardLayout';

import { OAuthErrorAlert } from '../OAuthErrorAlert';

type LandingContentProps = {
  handleSubmit: () => void;
  error: string | null;
  isButtonDisabled?: boolean;
  providerName?: string;
};

export function LandingContent({
  handleSubmit, error, isButtonDisabled, providerName,
}: LandingContentProps) {
  return (
    <AuthCardLayout>
      <FormControl>
        <FormLabel marginTop="16" marginBottom="0">
          <Heading as="h4" size="md">{`Set up ${providerName} integration`}</Heading>
        </FormLabel>
        <OAuthErrorAlert error={error} />
        <br />
        <Button
          variant="primary"
          isDisabled={isButtonDisabled}
          width="100%"
          type="submit"
          onClick={handleSubmit}
        >
          Next
        </Button>
      </FormControl>
    </AuthCardLayout>
  );
}
