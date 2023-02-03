import { Box } from '@chakra-ui/react';

interface CenteredTextBoxProps {
  text: string;
}

function CenteredTextBox({ text }: CenteredTextBoxProps) {
  return (<Box margin="auto" width="80px" paddingTop="30px">{text}</Box>);
}

export default CenteredTextBox;
