import { ErrorTextBox } from '../ErrorTextBox/ErrorTextBox';
import { LoadingCentered } from '../Loading';
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

export function ComponentContainerLoading() {
  return (
    <ComponentContainer>
      <LoadingCentered />
    </ComponentContainer>
  );
}

export function ComponentContainerError({ message }: { message: string; }) {
  return (
    <ComponentContainer>
      <ErrorTextBox message={message} />
    </ComponentContainer>
  );
}
