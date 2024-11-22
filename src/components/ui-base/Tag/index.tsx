type TagProps = {
  style?: React.CSSProperties,
  children: React.ReactNode,
};

const defaultStyle = {
  color: 'var(--amp-colors-text-regular)',
  backgroundColor: 'var(--amp-colors-bg-highlight)',
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
