import { Link, Text } from '@chakra-ui/react';

type DocsHelperTextProps = {
  url: string;
  providerDisplayName: string;
  credentialName: string;
};

export function DocsHelperText({ url, providerDisplayName, credentialName }: DocsHelperTextProps) {
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
      </Link> about where to find your {providerDisplayName} {credentialName}.
    </Text>
  );
}
