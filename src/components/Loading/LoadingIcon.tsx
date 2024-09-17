import {
  Box, Spinner, Stack,
} from '@chakra-ui/react';

/**
 * @deprecated - removing this component with Chakra
 * @returns
 */
export function LoadingIcon() {
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
      </Stack>
    </Box>
  );
}
