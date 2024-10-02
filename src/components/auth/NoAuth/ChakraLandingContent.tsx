import {
  Button, FormControl, FormLabel, Heading,
} from '@chakra-ui/react';

import { AuthErrorAlert } from 'src/components/auth/AuthErrorAlert/AuthErrorAlert';
import { AuthCardLayout } from 'src/layout/AuthCardLayout/AuthCardLayout';

import { LandingContentProps } from './LandingContentProps';

/**
 * @deprecated This component is deprecated and will be removed with chakra-ui
 * @param param0
 * @returns
 */
export function ChakraLandingContent({
  handleSubmit, error, isButtonDisabled, providerName,
}: LandingContentProps) {
  return (
    <AuthCardLayout>
      <FormControl>
        <FormLabel marginTop="16" marginBottom="0">
          <Heading as="h4" size="md">{`Set up ${providerName} integration`}</Heading>
        </FormLabel>
        <AuthErrorAlert error={error} />
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
