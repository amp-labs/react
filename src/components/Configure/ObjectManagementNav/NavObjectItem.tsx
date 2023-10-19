import { forwardRef } from 'react';
import {
  Box, Button, Text,
  useMultiStyleConfig, useTab,
} from '@chakra-ui/react';

import { NavIcon } from '../../../assets/NavIcon';

interface NavObjectItemProps {
  objectName: string;
  completed: boolean;
  pending?: boolean;
}

export const NavObjectItem = forwardRef<HTMLButtonElement, NavObjectItemProps>(
  ({ objectName, completed, pending }, ref) => {
    // 1. Reuse the `useTab` hook
    const tabProps = useTab({ ref });

    // 2. Hook into the Tabs `size`, `variant`, props
    const styles = useMultiStyleConfig('Tabs', tabProps);

    return (
      <Button __css={styles.tab} {...tabProps} variant="outline" minHeight={15}>
        <Box
          as="span"
          display="flex"
          alignItems="center"
          gap={2}
          mr="3"
        >
          {NavIcon(completed, pending)}
          <Box textAlign="left">
            <Text>{objectName}</Text>
            {pending && <Text fontSize={10} fontStyle="italic">pending</Text>}
          </Box>
        </Box>
        {tabProps.children}
      </Button>
    );
  },
);
