import { Box } from "src/components/ui-base/Box/Box";

import { ProblemMessage } from "components/ProblemMessage/ProblemMessage";

const defaultStyle = {
  backgroundColor: "var(--amp-colors-status-critical-muted)",
  borderColor: "var(--amp-colors-status-critical-muted)",
  color: "var(--amp-colors-status-critical-dark)",
  padding: ".5rem 1rem",
};

type FormErrorBoxProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export function FormErrorBox({ children, style }: FormErrorBoxProps) {
  return (
    <Box style={{ ...defaultStyle, ...style }}>
      {typeof children === "string" ? (
        <ProblemMessage message={children} />
      ) : (
        children
      )}
    </Box>
  );
}
