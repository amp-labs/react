import { Box } from "src/components/ui-base/Box/Box";

const defaultStyle = {
  backgroundColor: "var(--amp-colors-bg-highlight)",
  borderColor: "var(--amp-colors-bg-highlight)",
  padding: ".5rem 1rem",
};

type FormCalloutBoxProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export function FormCalloutBox({ children, style }: FormCalloutBoxProps) {
  return <Box style={{ ...defaultStyle, ...style }}>{children}</Box>;
}
