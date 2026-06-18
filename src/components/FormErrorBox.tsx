import { Box } from "src/components/ui-base/Box/Box";

const defaultStyle = {
  backgroundColor: "var(--amp-colors-status-critical-muted)",
  borderColor: "var(--amp-colors-status-critical-muted)",
  color: "var(--amp-colors-status-critical-dark)",
  padding: ".5rem 1rem",
};

/** Separates detail and remedy in serialized error strings from handleServerError. */
const REMEDY_DELIMITER = "\x1e";

function parseErrorMessage(message: string): { detail: string; remedy?: string } {
  const delimiterIndex = message.indexOf(REMEDY_DELIMITER);
  if (delimiterIndex === -1) {
    return { detail: message };
  }

  return {
    detail: message.slice(0, delimiterIndex),
    remedy: message.slice(delimiterIndex + REMEDY_DELIMITER.length),
  };
}

function ErrorMessageContent({ message }: { message: string }) {
  const { detail, remedy } = parseErrorMessage(message);

  return (
    <>
      <p style={{ margin: 0, lineHeight: 1.5, whiteSpace: "pre-line" }}>
        {detail}
      </p>
      {remedy && (
        <div
          style={{
            marginTop: "0.75rem",
            paddingTop: "0.75rem",
            borderTop:
              "1px solid var(--amp-colors-status-critical-dark, rgba(0, 0, 0, 0.15))",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.025em",
              marginBottom: "0.25rem",
              opacity: 0.85,
            }}
          >
            How to fix
          </span>
          <p style={{ margin: 0, lineHeight: 1.5, whiteSpace: "pre-line" }}>
            {remedy}
          </p>
        </div>
      )}
    </>
  );
}

type FormErrorBoxProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export function FormErrorBox({ children, style }: FormErrorBoxProps) {
  return (
    <Box style={{ ...defaultStyle, ...style }}>
      {typeof children === "string" ? (
        <ErrorMessageContent message={children} />
      ) : (
        children
      )}
    </Box>
  );
}
