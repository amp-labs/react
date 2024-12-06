import { Box } from '../ui-base/Box/Box';
import { Container } from '../ui-base/Container/Container';

export function ComponentContainer({ children }: { children: React.ReactNode; }) {
  return (
    <Container style={{ maxWidth: '55rem' }}>
      <Box>
        {children}
      </Box>
    </Container>
  );
}
