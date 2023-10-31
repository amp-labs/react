import {
  Box, Spinner, Stack, Text,
} from '@chakra-ui/react';

interface LoadingIconProps {
  message?: string;
}

export function LoadingIcon({ message }: LoadingIconProps) {
  return (
    <Box
      className="loading-icon"
      height="100%"
      width="100%"
      display="flex"
      justifyContent="center"
      marginTop="20%"
      marginBottom="20%"
    >
      <Stack alignItems="center">
        <Spinner
          height="100px"
          width="100px"
          alignSelf="center"
          thickness="8px"
          speed="1s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
          margin="20px"
        />
        {message && <Text fontSize="40px" color="#4299e1">{message}</Text>}
      </Stack>
    </Box>
  );
}
