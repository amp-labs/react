import {
  Button, Flex, FormControl,
  FormLabel, Heading, Input,
} from '@chakra-ui/react';

import { AuthErrorAlert } from 'components/auth/AuthErrorAlert/AuthErrorAlert';
import { AuthCardLayout } from 'src/layout/AuthCardLayout/AuthCardLayout';

import { WorkspaceEntryProps } from './WorkspaceEntryProps';

/**
 * @deprecated - delete file after removing chakra-ui
 * @param param0
 * @returns
 */
export function ChakraWorkspaceEntry({
  handleSubmit, setWorkspace, error, isButtonDisabled, providerName,
}: WorkspaceEntryProps) {
  return (
    <AuthCardLayout>
      <FormControl>
        <FormLabel marginTop="16" marginBottom="0">
          <Heading as="h4" size="md">Enter your {providerName} workspace</Heading>
        </FormLabel>
        <AuthErrorAlert error={error} />
        <Flex marginTop="1em">
          <Input
            placeholder="MyWorkspace"
            onChange={(event) => setWorkspace(event.currentTarget.value)}
          />
        </Flex>
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
