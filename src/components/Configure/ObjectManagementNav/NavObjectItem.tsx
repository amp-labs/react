import { forwardRef } from 'react';
import {
  Box, Button, useMultiStyleConfig, useTab,
} from '@chakra-ui/react';

import { NavIcon } from '../../../assets/NavIcon';

interface NavObjectItemProps {
  objectName: string;
  completed: boolean;
}

export const NavObjectItem = forwardRef<HTMLButtonElement, NavObjectItemProps>(
  ({ objectName, completed }, ref) => {
    // 1. Reuse the `useTab` hook
    const tabProps = useTab({ ref });

    // 2. Hook into the Tabs `size`, `variant`, props
    const styles = useMultiStyleConfig('Tabs', tabProps);

    return (
      <Button __css={styles.tab} {...tabProps} variant="outline">
        <Box
          as="span"
          display="flex"
          alignItems="center"
          gap={2}
          mr="3"
        >
          {NavIcon(completed)} {objectName}
        </Box>
        {tabProps.children}
      </Button>
    );
  },
);