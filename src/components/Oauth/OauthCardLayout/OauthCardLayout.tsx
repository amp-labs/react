import { Container } from '@chakra-ui/react';

import { Box } from 'src/components/ui-base/Box/Box';

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
