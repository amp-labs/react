import { useProject } from 'context/ProjectContextProvider';
import { getProviderName } from 'src/utils';

import { LoadingCentered } from '../Loading';
import { SuccessTextBox } from '../SuccessTextBox/SuccessTextBox';

interface ConnectedSuccessBoxProps {
  provider: string;
}
export function ConnectedSuccessBox({ provider }: ConnectedSuccessBoxProps) {
  const { appName, isLoading } = useProject();
  const text = `You have successfully connected your ${getProviderName(provider)} account to ${appName}.`;

  if (isLoading) return <LoadingCentered />;

  return <SuccessTextBox text={text} />;
}
