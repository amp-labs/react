import { Flex, Heading } from '@chakra-ui/react';

import { Divider } from 'src/components/ui-base/Divider';

interface FieldHeaderProps {
  string: string;
}

export function FieldHeader({ string }: FieldHeaderProps) {
  return (
    <Flex position="relative" paddingTop={8} paddingBottom={4}>
      <Heading color="gray.500" as="h3" fontSize={16} fontWeight="500">
        {string}
      </Heading>
      <Flex flex="1" justifyContent="flex-end" alignItems="center">
        <Divider style={{ marginLeft: '1rem' }} />
      </Flex>
    </Flex>
  );
}
