import {
  Box, Spinner, Stack, Text,
} from '@chakra-ui/react';

export function LoadingIcon() {
  return (
    <Box
      className="loading-icon"
      height="100%"
      width="100%"
      display="flex"
      justifyContent="center"
      marginTop="200px"
    >
      <Stack alignItems="center">
        <Spinner
          height="100px"
          width="100px"
          alignSelf="center"
          thickness="6px"
          speed="1s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
          margin="20px"
        />
        <Text fontSize="40px" color="#4299e1">Loading...</Text>
      </Stack>

    </Box>
  );
}
