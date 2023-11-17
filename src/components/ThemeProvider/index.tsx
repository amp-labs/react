import { ChakraProvider, extendTheme, withDefaultColorScheme } from '@chakra-ui/react';

const customTheme = extendTheme({
  components: {
    Tabs: {
      baseStyle: {
        tab: {
          width: '100%',
          borderRadius: '4px',
          _hover: {
            bg: 'gray.300',
          },
          _selected: {
            color: 'black', // Set the color of the selected tab to 'black
            fontWeight: '500', // Set the font weight of the selected tab
            bg: 'gray.200', // Set the background color of the selected tab
            border: 'none',
            _hover: {
              bg: 'gray.300',
            },
          },
        },
        // todo: create variants
        redTab: {
          width: '100%',
          borderRadius: '4px',
          _hover: {
            bg: 'red.200',
          },
          _selected: {
            color: 'red.800', // Set the color of the selected tab
            fontWeight: '500', // Set the font weight of the selected tab
            bg: 'red.100', // Set the background color of the selected tab
            border: 'none',
            _hover: {
              bg: 'red.200',
            },
          },
        },
      },
    },
  },
});

const theme = extendTheme(
  withDefaultColorScheme({
    colorScheme: 'facebook',
    components: ['Button'],
  }),
  customTheme,
);

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
