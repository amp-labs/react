import { Box } from '@chakra-ui/react';

interface CenteredTextBoxProps {
  text: string;
}

function CenteredTextBox({ text }: CenteredTextBoxProps) {
  return (<Box margin="auto" width="100%" paddingTop="30px">{text}</Box>);
}

export default CenteredTextBox;
