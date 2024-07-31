import { Text } from '@chakra-ui/react';

export function DocsURL({ url, children }: { url: string | undefined, children: React.ReactNode; }) {
  if (!url) {
    return null;
  }

  return (
    <Text align="right" color="darkgray">
      <em>
        <a href={url} target="_blank" rel="noreferrer">
          {children}
        </a>
      </em>
    </Text>
  );
}
