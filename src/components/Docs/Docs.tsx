import { Link, Text } from '@chakra-ui/react';

type DocsURLProps = {
  url: string;
  provider: string;
  credentialName: string;
};

export function DocsURL({ url, provider, credentialName }: DocsURLProps) {
  return (
    <Text align="left" color="darkgray">
      <Link
        href={url}
        target="_blank"
        rel="noreferrer"
        color="blackAlpha.600"
        isExternal
      >
        <span style={{ textDecoration: 'underline' }}>Learn more</span>
      </Link> about where to find your {provider} {credentialName}.
    </Text>
  );
}
