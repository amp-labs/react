import {
  Button, Flex, FormControl,
  FormLabel, Heading, Input,
} from '@chakra-ui/react';

import { capitalize } from 'src/utils';

import { OauthCardLayout } from '../OauthCardLayout';
import { OAuthErrorAlert } from '../OAuthErrorAlert';

type WorkspaceEntryProps = {
  provider: string,
  handleSubmit: () => void;
  setWorkspace: (workspace: string) => void;
  error: string | null;
  isButtonDisabled?: boolean;
};

export function WorkspaceEntry({
  provider, handleSubmit, setWorkspace, error, isButtonDisabled,
}: WorkspaceEntryProps) {
  return (
    <OauthCardLayout>
      <FormControl>
        <FormLabel marginTop="16" marginBottom="0">
          <Heading as="h4" size="md">Enter your {capitalize(provider)} workspace</Heading>
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
