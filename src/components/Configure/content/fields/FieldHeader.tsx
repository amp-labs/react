import { Divider, Flex, Heading } from '@chakra-ui/react';

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
        <Divider marginLeft={2} />
      </Flex>
    </Flex>
  );
}
