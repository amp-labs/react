import { Box } from 'src/components/ui-base/Box/Box';

const defaultStyle = {
  backgroundColor: 'var(--amp-colors-status-success-muted)',
  borderColor: 'var(--amp-colors-status-success-muted)',
  color: 'var(--amp-colors-status-success-dark)',
  padding: '.5rem 1rem',
};

type FormSuccessBoxProps = {
  children: React.ReactNode,
  style?: React.CSSProperties,
};

export function FormSuccessBox({ children, style }: FormSuccessBoxProps) {
  return (
    <Box style={{ ...defaultStyle, ...style }}>{children}</Box>
  );
}
