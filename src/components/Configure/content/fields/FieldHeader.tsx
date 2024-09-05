import { Divider, Heading } from '@chakra-ui/react';
import { Flex } from '@radix-ui/themes';

interface FieldHeaderProps {
  string: string;
}

export function FieldHeader({ string }: FieldHeaderProps) {
  return (
    <Flex position="relative" pt="8" pb="4">
      <Heading color="gray.500" as="h3" fontSize={16} fontWeight="500">
        {string}
      </Heading>
      <Flex justify="end" align="center">
        <Divider marginLeft={2} />
      </Flex>
    </Flex>
  );
}
