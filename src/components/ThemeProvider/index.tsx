import {
  ChakraProvider, extendTheme,
} from '@chakra-ui/react';

import { buttonVariants } from './Button';

const customTheme = extendTheme({
  components: {
    Tabs: {
      baseStyle: {
        tab: {
          width: '100%',
          borderRadius: '4px',
          _hover: {
            bg: 'gray.200',
          },
          _selected: {
            color: 'black', // Set the color of the selected tab to 'black
            fontWeight: '500', // Set the font weight of the selected tab
            bg: 'gray.100', // Set the background color of the selected tab
            border: 'none',
            _hover: {
              bg: 'gray.200',
            },
          },
        },
        // consider creating a warning variant tab
        warningTab: {
          width: '100%',
          borderRadius: '4px',
          _hover: {
            bg: 'red.100',
          },
          _selected: {
            color: 'red.800', // Set the color of the selected tab
            fontWeight: '500', // Set the font weight of the selected tab
            bg: 'red.50', // Set the background color of the selected tab
            border: 'none',
            _hover: {
              bg: 'red.100',
            },
          },
        },
      },
    },
    Button: {
      variants: buttonVariants,
    },
  },
});

const theme = extendTheme(customTheme);

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  );
}
