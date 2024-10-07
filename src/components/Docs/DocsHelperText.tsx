import { AccessibleLink } from '../ui-base/AccessibleLink';

type DocsHelperTextProps = {
  url: string;
  providerDisplayName: string;
  credentialName: string;
};

// fallback during migration away from chakra-ui, when variable is not defined
const color = getComputedStyle(document.documentElement)
  .getPropertyValue('--amp-colors-text-secondary').trim() || '#737373';

export function DocsHelperText({ url, providerDisplayName, credentialName }: DocsHelperTextProps) {
  return (
    <p style={{ color }}>
      <AccessibleLink href={url} newTab>
        <span style={{ textDecoration: 'underline' }}>Learn more</span>
      </AccessibleLink> about where to find your {providerDisplayName} {credentialName}.
    </p>
  );
}
