import { Box } from 'src/components/ui-base/Box/Box';

// fallback during migration away from chakra-ui, when variable is not defined
const backgroundColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--amp-colors-error-background').trim() || '#FEF2F2';

const borderColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--amp-colors-error-border').trim() || '#FECACA';

const color = getComputedStyle(document.documentElement)
  .getPropertyValue('--amp-colors-error-text').trim() || '#991B1B';

const defaultStyle = {
  backgroundColor,
  borderColor,
  color,
  padding: '.5rem 1rem',
};

type FormErrorBoxProps = {
  children: React.ReactNode,
  style?: React.CSSProperties,
};

export function FormErrorBox({ children, style }: FormErrorBoxProps) {
  return (
    <Box style={{ ...defaultStyle, ...style }}>{children}</Box>
  );
}
