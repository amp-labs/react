import { Box, Text } from '@chakra-ui/react';

interface ErrorTextBoxProps {
  message: string,
}

export function ErrorTextBox({ message }: ErrorTextBoxProps) {
  return (
    <Box
      minHeight="300px"
      padding="30px"
      display="flex"
      flexDirection="column"
      justifyContent="space-evenly"
      alignItems="center"
    >
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          // eslint-disable-next-line max-len
          d="M20.5796 7.72236L3.63955 36.0024C3.29029 36.6072 3.10549 37.293 3.10353 37.9914C3.10158 38.6898 3.28254 39.3766 3.62841 39.9834C3.97428 40.5902 4.473 41.0959 5.07497 41.4501C5.67693 41.8043 6.36115 41.9947 7.05955 42.0024H40.9396C41.638 41.9947 42.3222 41.8043 42.9241 41.4501C43.5261 41.0959 44.0248 40.5902 44.3707 39.9834C44.7166 39.3766 44.8975 38.6898 44.8956 37.9914C44.8936 37.293 44.7088 36.6072 44.3596 36.0024L27.4196 7.72236C27.063 7.13458 26.561 6.6486 25.9619 6.31133C25.3629 5.97406 24.687 5.79688 23.9996 5.79688C23.3121 5.79688 22.6362 5.97406 22.0372 6.31133C21.4381 6.6486 20.9361 7.13458 20.5796 7.72236Z"
          stroke="#7F1D1D"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M24 18V26" stroke="#7F1D1D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 34H24.02" stroke="#7F1D1D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <Box
        boxSizing="border-box"
        display="flex"
        justifyContent="center"
        alignItems="center"
        align-self="stretch"
        padding="12px 50px 12px 50px"
        borderRadius="8px"
        border="2px solid #FECACA"
        background="#FEF2F2"
      >
        <Text color="#991B1B">
          {message}
        </Text>
      </Box>
    </Box>
  );
}
