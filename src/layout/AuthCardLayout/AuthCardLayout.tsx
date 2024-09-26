import { Box } from 'components/ui-base/Box/Box';
import { Container } from 'components/ui-base/Container/Container';

import { AmpersandFooter } from './AmpersandFooter';

type AuthCardLayoutProps = {
  children: React.ReactNode;
};

export function AuthCardLayout({ children }: AuthCardLayoutProps) {
  return (
    <Container>
      <Box>
        <div style={{ padding: '3rem 2rem' }}>
          {children}
        </div>
        <AmpersandFooter />
      </Box>
    </Container>
  );
}

export function AuthTitle({ children }: AuthCardLayoutProps) {
  return (
    <h1 style={{ fontWeight: 600, lineHeight: 1.2, fontSize: '1.2em' }}>{children}</h1>
  );
}
