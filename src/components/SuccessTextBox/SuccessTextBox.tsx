import { SuccessCheckmarkIcon } from 'assets/SuccessIcon';

import { Box } from '../ui-base/Box/Box';
import { Container } from '../ui-base/Container/Container';

interface ConnectedSuccessBoxProps {
  text: string;
  children?: React.ReactNode;
}
export function SuccessTextBox({ text, children }: ConnectedSuccessBoxProps) {
  return (
    <Container>
      <Box style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '3rem',
        gap: '3rem',
        // todo: box shadow is --amp-shadows-md (convert to module.css after removing chakra)
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}
      >
        <SuccessCheckmarkIcon />
        <p>{text}</p>
        {children}
      </Box>
    </Container>
  );
}
