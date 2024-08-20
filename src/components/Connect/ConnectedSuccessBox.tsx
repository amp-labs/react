import { useProject } from 'context/ProjectContextProvider';
import { getProviderName } from 'src/utils';

import { SuccessTextBox } from '../SuccessTextBox';

interface ConnectedSuccessBoxProps {
  provider: string;
}
export function ConnectedSuccessBox({ provider }: ConnectedSuccessBoxProps) {
  const { appName } = useProject();
  const text = `You have successfully connected your ${getProviderName(provider)} account to ${appName}.`;
  return (
    <SuccessTextBox text={text} />
  );
}
