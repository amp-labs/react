import { Box, Container } from '@chakra-ui/react';

type NoAuthCardLayoutProps = {
  children: React.ReactNode;
};

export function NoAuthCardLayout({ children }: NoAuthCardLayoutProps) {
  return (
    <Container>
      <Box
        p={8}
        maxWidth="600px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        textAlign={['left']}
        margin="auto"
        marginTop="40px"
        bgColor="white"
        color="gray.800"
        fontSize="md"
      >
        {children}
      </Box>
    </Container>
  );
}
