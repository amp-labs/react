import { ErrorTextBox } from '../ErrorTextBox/ErrorTextBox';
import { LoadingCentered } from '../Loading';
import { Box } from '../ui-base/Box/Box';
import { Container } from '../ui-base/Container/Container';

/**
 * Container (auto aligned center) with border to wrap some content. Usually the outer most container for
 * Ampersand public components.
 * @param param0
 * @returns
 */
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
