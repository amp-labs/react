import { Container } from '@chakra-ui/react';
import { Box } from '@styled-system/jsx';

type OauthCardLayoutProps = {
  children: React.ReactNode;
};

export function OauthCardLayout({ children }: OauthCardLayoutProps) {
  return (
    <Container>
      <Box
        // style={{ padding: '3rem 2rem', borderRadius: '4px', border: '1px solid #EFEFEF' }}
        className="OauthCardLayout"
        backgroundColor="white"
        p={8}
        maxWidth="600px"
        borderRadius="sm"
        borderColor="gray.200"
        // border="1px solid #EFEFEF"
        // textAlign={['left']}
        // margin="auto"
        // marginTop="40px"
        // // bgColor="white"
        // color="gray.800"
        // fontSize="md"
        // border="1px solid #EFEFEF"
      >
        {children}
      </Box>
    </Container>
  );
}
