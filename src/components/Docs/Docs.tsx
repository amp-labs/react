import { Link, Text } from '@chakra-ui/react';

type DocsURLProps = {
  url: string | undefined;
  provider: string;
  credentialName: string;
};

export function DocsURL({ url, provider, credentialName }: DocsURLProps) {
  if (!url) {
    return null;
  }

  return (
    <Text align="left" color="darkgray">
      <em>
        <Link
          href={url}
          target="_blank"
          rel="noreferrer"
          color="blackAlpha.600"
          isExternal
        >
          Learn more
        </Link> about where to find your {provider} {credentialName}.
      </em>
    </Text>
  );
}
