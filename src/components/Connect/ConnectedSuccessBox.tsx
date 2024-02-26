import { useProject } from '../../context/ProjectContextProvider';
import { capitalize } from '../../utils';
import { SuccessTextBox } from '../SuccessTextBox';

interface ConnectedSuccessBoxProps {
  provider: string;
}
export function ConnectedSuccessBox({ provider }: ConnectedSuccessBoxProps) {
  const { appName } = useProject();
  const text = `You have successfully connected your ${capitalize(provider)} account to ${appName}.`;
  return (
    <SuccessTextBox text={text} />
  );
}
