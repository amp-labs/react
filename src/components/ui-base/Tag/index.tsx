type TagProps = {
  style?: React.CSSProperties,
  children: React.ReactNode,
};

const backgroundColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--amp-colors-badge').trim() || '#e5e5e5';

const color = getComputedStyle(document.documentElement)
  .getPropertyValue('--amp-colors-badge-text').trim() || '#404040';

const defaultStyle = {
  color,
  backgroundColor,
  borderRadius: '4px',
  display: 'inline-block',
  fontSize: '0.75rem',
  fontWeight: 500,
  lineHeight: '1.25',
  padding: '0.25rem 0.5rem',
};

export function Tag({ children, style, ...props }: TagProps) {
  return (
    <span
      style={{ ...defaultStyle, ...style }}
      {...props}
    >{children}
    </span>
  );
}
