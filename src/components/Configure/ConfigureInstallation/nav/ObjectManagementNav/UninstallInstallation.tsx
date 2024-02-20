import { forwardRef } from 'react';
import {
  Box, Button, Text, useMultiStyleConfig, useTab,
} from '@chakra-ui/react';

import { TrashIcon } from '../../../../../assets/TrashIcon';

interface NavObjectItemProps {
  text?: string;
}

export const UNINSTALL_INSTALLATION_CONST = 'uninstall-installation';

export const UninstallInstallation = forwardRef<HTMLButtonElement, NavObjectItemProps>(
  ({ text = 'Uninstall' }, ref) => {
    // 1. Reuse the `useTab` hook
    const tabProps = useTab({ ref });

    // 2. Hook into the Tabs `size`, `variant`, props
    const styles = useMultiStyleConfig('Tabs', tabProps);

    return (
      <Button
        __css={styles.warningTab}
        {...tabProps}
        minHeight={15}
      >
        <Box
          as="span"
          display="flex"
          alignItems="center"
          gap={2}
          my={2}
          mx={4}
        >
          {TrashIcon()}
          <Box textAlign="left">
            <Text color="red.800">{text}</Text>
          </Box>
        </Box>
        {tabProps.children}
      </Button>
    );
  },
);
