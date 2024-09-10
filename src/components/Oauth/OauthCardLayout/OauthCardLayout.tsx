import { Box, Container } from '@chakra-ui/react';

import { AmpersandFooter } from './AmpersandFooter';

type OauthCardLayoutProps = {
  children: React.ReactNode;
};

export function OauthCardLayout({ children }: OauthCardLayoutProps) {
  return (
    <Container>
      <Box
        maxWidth="600px"
        borderWidth={1}
        borderRadius={4}
      >
        <div style={{ padding: '3rem 2rem' }}>
          {children}
        </div>
        <AmpersandFooter />
      </Box>
    </Container>
  );
}
