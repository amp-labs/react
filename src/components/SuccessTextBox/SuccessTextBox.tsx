import { SuccessCheckmarkIcon } from "assets/SuccessIcon";

import { Box } from "../ui-base/Box/Box";
import { Container } from "../ui-base/Container/Container";

interface ConnectedSuccessBoxProps {
  text: string;
  children?: React.ReactNode;
}
export function SuccessTextBox({ text, children }: ConnectedSuccessBoxProps) {
  return (
    <Container>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "3rem",
          gap: "3rem",
        }}
      >
        <SuccessCheckmarkIcon />
        <p>{text}</p>
        {children}
      </Box>
    </Container>
  );
}
