export const tabVariants = {
  warning: {
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
};
