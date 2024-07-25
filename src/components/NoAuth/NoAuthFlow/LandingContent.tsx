import {
  Button, FormControl, FormLabel, Heading,
} from '@chakra-ui/react';

import { NoAuthCardLayout } from 'components/NoAuth/NoAuthCardLayout';
import { NoAuthErrorAlert } from 'components/NoAuth/NoAuthErrorAlert';
import { capitalize } from 'src/utils';

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
    <NoAuthCardLayout>
      <FormControl>
        <FormLabel marginTop="16" marginBottom="0">
          <Heading as="h4" size="md">{`Set up ${capitalize(provider)} integration`}</Heading>
        </FormLabel>
        <NoAuthErrorAlert error={error} />
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
    </NoAuthCardLayout>
  );
}
