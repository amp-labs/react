import { ChakraProvider, extendTheme, withDefaultColorScheme } from '@chakra-ui/react';

const customTheme = extendTheme({
  components: {
    Tabs: {
      baseStyle: {
        tab: {
          width: '100%',
          borderRadius: '4px',
          _selected: {
            color: 'black', // Set the color of the selected tab to 'black
            fontWeight: '500', // Set the font weight of the selected tab
            bg: 'blue.100', // Set the background color of the selected tab to blue.100
            border: 'none',
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
