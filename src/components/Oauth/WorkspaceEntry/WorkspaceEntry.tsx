import {
  Button, Flex, FormControl,
  FormLabel, Heading, Input,
} from '@chakra-ui/react';

import { AuthCardLayout } from 'src/layout/AuthCardLayout/AuthCardLayout';

import { OAuthErrorAlert } from '../OAuthErrorAlert';

type WorkspaceEntryProps = {
  handleSubmit: () => void;
  setWorkspace: (workspace: string) => void;
  error: string | null;
  isButtonDisabled?: boolean;
  providerName?: string;
};

export function WorkspaceEntry({
  handleSubmit, setWorkspace, error, isButtonDisabled, providerName,
}: WorkspaceEntryProps) {
  return (
    <AuthCardLayout>
      <FormControl>
        <FormLabel marginTop="16" marginBottom="0">
          <Heading as="h4" size="md">Enter your {providerName} workspace</Heading>
        </FormLabel>
        <OAuthErrorAlert error={error} />
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
