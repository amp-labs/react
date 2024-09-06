import { Box, Container } from '@chakra-ui/react';

type BasicAuthCardLayoutProps = {
  children: React.ReactNode;
};

export function BasicAuthCardLayout({ children }: BasicAuthCardLayoutProps) {
  return (
    <Container>
      <Box
        p={8}
        maxWidth="600px"
        borderWidth={1}
        borderRadius={4}
        margin="auto"
        marginTop="40px"
        fontSize="md"
      >
        {children}
      </Box>
    </Container>
  );
}
