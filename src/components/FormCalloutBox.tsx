import { Box } from 'src/components/ui-base/Box/Box';

// fallback during migration away from chakra-ui, when variable is not defined
const backgroundColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--amp-colors-callout-background').trim() || '#f5f5f5';

const defaultStyle = {
  backgroundColor,
  border: 'none',
  padding: '.5rem 1rem',
};

type FormCalloutBoxProps = {
  children: React.ReactNode,
  style?: React.CSSProperties,
};

export function FormCalloutBox({ children, style }: FormCalloutBoxProps) {
  return (
    <Box style={{ ...defaultStyle, ...style }}>{children}</Box>
  );
}
