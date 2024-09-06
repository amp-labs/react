// define custom button variants
export const buttonVariants = {
  primary: {
    bg: 'black', // Background color
    color: 'white', // Text color
    _hover: {
      bg: 'gray.700', // Background color on hover
      _disabled: {
        bg: 'gray.600', // Background color for disabled state
      },
    },
    _disabled: {
      bg: 'gray.600', // Background color for disabled state
      color: 'gray.300', // Text color for disabled state
      cursor: 'not-allowed', // Optional: Disable the pointer
      opacity: 1, // Ensure it is fully visible (no transparency)
    },
  },
  warning: {
    bg: 'red.50', // Background color
    outline: '2px solid red.100',
    outlineOffset: '0',
    borderColor: 'red.100', // Border color
    color: 'red.800', // Text color
    _hover: {
      bg: 'red.100', // Background color on hover
    },
  },
};
