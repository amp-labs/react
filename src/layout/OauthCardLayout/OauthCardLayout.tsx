import { Box } from 'components/ui-base/Box/Box';
import { Container } from 'components/ui-base/Container/Container';

import { AmpersandFooter } from './AmpersandFooter';

type OauthCardLayoutProps = {
  children: React.ReactNode;
};

export function OauthCardLayout({ children }: OauthCardLayoutProps) {
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
