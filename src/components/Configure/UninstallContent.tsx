import { Button, Stack } from '@chakra-ui/react';

export function UninstallContent() {
  return (
    <Stack>
      <div>Once you uninstall this integration with Salesforce, all of your current historical
        configuration will be lost, and you app may stop working.
      </div>
      {/* todo create warning variants */}
      <Button variant="warning">Uninstall</Button>
    </Stack>
  );
}
