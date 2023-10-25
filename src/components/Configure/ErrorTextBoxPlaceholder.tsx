import CenteredTextBox from '../CenteredTextBox/CenteredTextBox';

interface ErrorTextBoxPlaceholderProps {
  message: string,
}

export function ErrorTextBoxPlaceholder({ message }: ErrorTextBoxPlaceholderProps) {
  return <CenteredTextBox text={message} />;
}
